import logger from '../config/logger.js';
import { pool } from "../config/db.js";

export const countActiveDoctors = async () => {
    try {
        logger.info("Counting active doctors...");

        const [result] = await pool.query(
            `SELECT COUNT(*) AS count FROM doctors WHERE is_active = TRUE`
        );

        if (!result?.[0]?.count && result?.[0]?.count !== 0) {
            logger.error("Unexpected result format while counting active doctors");
            throw new Error("Unexpected result format from database");
        }

        logger.info(`Total active doctors: ${result[0].count}`);
        return result[0].count || 0;
    } catch (error) {
        logger.error(`Failed to count active doctors. Error: ${error.message}`);
        throw new Error("Database query failed while counting active doctors");
    }
};

export const getActiveDoctors = async (limit, offset) => {
    try {
        logger.info(`Fetching active doctors. Limit: ${limit}, Offset: ${offset}`);

        const [doctors] = await pool.query(
        `SELECT * FROM doctors WHERE is_active = TRUE LIMIT ? OFFSET ?`,
        [limit, offset]
        );

        for (const doctor of doctors) {
            const [availability] = await pool.query(
                `SELECT day_of_week AS day, start_time AS 'from', end_time AS 'to'
                FROM doctor_schedule
                WHERE doctor_id = ?`,
                [doctor.id]
            );
            doctor.availability = availability;

            const [specialties] = await pool.query(
                `SELECT s.name 
                FROM doctor_specialties ds
                JOIN specialties s ON s.id = ds.specialty_id
                WHERE ds.doctor_id = ?`,
                [doctor.id]
            );
            doctor.specialties = specialties.map(row => row.name);
        }

        logger.info(`Retrieved ${doctors.length} active doctors`);
        return doctors;
    } catch (error) {
        logger.error(`Failed to retrieve active doctors with schedules. Error: ${error.message}`);
        throw new Error("Database query failed while fetching active doctors with schedule");
    }
};  

export const getSpecialtiesFromDB = async () => {
    try {
        logger.info("Fetching specialties from the database");

        const [rows] = await pool.query(
            `SELECT * FROM specialties`
        )

        logger.info(`Retrieved ${rows.length} specialties`);
        return rows
    } catch (error) {
        logger.error(`Failed to retrieve specialties. Error: ${error.message}`);
        throw new Error("Database query failed while fetching specialties");
    }
}

export const countAllDoctors = async () => {
    try {
        logger.info("Counting all doctors in the database.");

        const [result] = await pool.query(
            `SELECT COUNT(*) AS count FROM doctors`
        );

        if (!result?.[0]?.count && result?.[0]?.count !== 0) {
            logger.error("Unexpected result structure: count is missing.");
            throw new Error("Unexpected result structure: count is missing");
        }

        logger.info(`Total doctors count: ${result[0].count}`);
        return result[0].count || 0;
    } catch (error) {
        logger.error(`Failed to count doctors. Error: ${error.message}`);
        throw new Error("Failed to count doctors in the database");
    }
};

export const getAllDoctorsFromDB = async (limit, offset) => {
    try {
        logger.info(`Fetching all doctors. Limit: ${limit}, Offset: ${offset}`);

        const [doctors] = await pool.query(
            `SELECT * FROM doctors LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        for (const doctor of doctors) {
            const [availability] = await pool.query(
            `SELECT day_of_week AS day, start_time AS 'from', end_time AS 'to'
                FROM doctor_schedule
                WHERE doctor_id = ?`,
            [doctor.id]
            );
            doctor.availability = availability;

            const [specialties] = await pool.query(
            `SELECT s.name 
                FROM doctor_specialties ds
                JOIN specialties s ON s.id = ds.specialty_id
                WHERE ds.doctor_id = ?`,
            [doctor.id]
            );
            doctor.specialties = specialties.map(row => row.name);
        }

        logger.info(`Successfully retrieved ${doctors.length} doctors.`);
        return doctors;
    } catch (error) {
        logger.error(`Failed to retrieve all doctors. Error: ${error.message}`);
        throw new Error("Database query failed while fetching all doctors");
    }
};

export const findDoctorByEmailOrPhone = async (email, phone) => {
    if (!email && !phone) {
        logger.warn("Both email and phone are missing in findDoctorByEmailOrPhone.");
        throw new Error("Both email and phone are missing in findDoctorByEmailOrPhone");
    }

    try {
        logger.info(`Searching for doctor with Email: ${email || "N/A"}, Phone: ${phone || "N/A"}`);

        const query = `
            SELECT * FROM doctors 
            WHERE (email = ? OR phone = ?) AND is_active = TRUE
        `;
        const [rows = []] = await pool.query(query, [email || null, phone || null]);

        if (!Array.isArray(rows)) {
            logger.error("Unexpected response format from database.");
            throw new Error("Unexpected response format from database.");
        }

        logger.info(`Found ${rows.length} doctor(s) matching criteria.`);
        return rows;
    } catch (error) {
        logger.error(`Database query failed in findDoctorByEmailOrPhone. Error: ${error.message}`);
        throw new Error("Database query failed in findDoctorByEmailOrPhone");
    }
};

export const createDoctorInDB = async ({
    first_name,
    last_name,
    phone,
    email,
    years_of_experience = 0,
    is_active = true,
    specialties = [],       
    availability = []      
    }) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        logger.info(`Creating new doctor: ${first_name} ${last_name}`);

        // Doctor
        const [result] = await connection.query(
            `INSERT INTO doctors 
                (first_name, last_name, phone, email, years_of_experience, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [first_name, last_name, phone, email, years_of_experience, is_active]
        );

        const doctorId = result.insertId;

        if (!doctorId) {
            throw new Error("Failed to create doctor: insertId missing");
        }

        // Specialties
        for (const specialtyName of specialties) {
        const [[specialty]] = await connection.query(
            `SELECT id FROM specialties WHERE name = ? LIMIT 1`,
            [specialtyName]
        );

        if (!specialty) {
            throw new Error(`Specialty "${specialtyName}" not found`);
        }

        await connection.query(
            `INSERT INTO doctor_specialties (doctor_id, specialty_id) VALUES (?, ?)`,
            [doctorId, specialty.id]
        );
        }

        // Availability
        const dayMap = {
            Monday: 'mon',
            Tuesday: 'tue',
            Wednesday: 'wed',
            Thursday: 'thu',
            Friday: 'fri',
            Saturday: 'sat',
            Sunday: 'sun',
        };          

        for (const slot of availability) {
            const { day, from, to } = slot;
            
            if (!day || !from || !to) {
                throw new Error(`Invalid availability slot: ${JSON.stringify(slot)}`);
            }
            
            const dbDay = dayMap[day];
            if (!dbDay) {
                throw new Error(`Invalid day provided in availability: "${day}". Must be a valid weekday name.`);
            }
            
            await connection.query(
                `INSERT INTO doctor_schedule 
                (doctor_id, day_of_week, start_time, end_time) 
                VALUES (?, ?, ?, ?)`,
                [doctorId, dbDay, from, to]
            );
        }

        await connection.commit();
        logger.info(`Doctor created successfully with ID: ${doctorId}`);
        return doctorId;

    } catch (error) {
        await connection.rollback();
        logger.error(`Failed to create doctor. Error: ${error.message}`);
        throw new Error(`Failed to create doctor: ${error.message}`);
    } finally {
        connection.release();
    }
};

export const getDoctorById = async (id) => {
    try {
        logger.info(`Fetching doctor with ID: ${id}`);

        const [doctorRows] = await pool.query(
            `SELECT * FROM doctors WHERE id = ?`,
            [id]
        );

        const doctor = doctorRows[0] || null;
        if (!doctor) {
            logger.warn(`Doctor with ID ${id} not found.`);
            return null;
        }

        const [availabilityRows] = await pool.query(
            `SELECT day_of_week AS day, start_time AS 'from', end_time AS 'to'
            FROM doctor_schedule
            WHERE doctor_id = ?`,
            [id]
        );
        doctor.availability = availabilityRows;

        const [specialtyRows] = await pool.query(
            `SELECT s.name 
            FROM doctor_specialties ds
            JOIN specialties s ON s.id = ds.specialty_id
            WHERE ds.doctor_id = ?`,
            [id]
        );
        doctor.specialties = specialtyRows.map(row => row.name);
    
        logger.info(`Doctor found: ${JSON.stringify(doctor)}`);
        return doctor;
    } catch (error) {
        logger.error(`Failed to retrieve doctor by ID ${id}. Error: ${error.message}`);
        throw new Error(`Failed to retrieve doctor by ID: ${error.message}`);
    }
};

export const deactivateDoctorById = async (id) => {
    try {
        logger.info(`Attempting to deactivate doctor with ID: ${id}`);

        const [result] = await pool.query(
            `UPDATE doctors SET is_active = FALSE WHERE id = ? AND is_active = TRUE`,
            [id]
        );

        if (result.affectedRows > 0) {
            logger.info(`Doctor with ID ${id} successfully deactivated.`);
            return true;
        } else {
            logger.warn(`Doctor with ID ${id} was not deactivated (possibly already inactive or not found).`);
            return false;
        }
    } catch (error) {
        logger.error(`Failed to deactivate doctor with ID ${id}. Error: ${error.message}`);
        throw new Error("Failed to update doctor status: " + error.message);
    }
};

export const activateDoctorById = async (id) => {
    try {
        logger.info(`Attempting to activate doctor with ID: ${id}`);

        const [result] = await pool.query(
            `UPDATE doctors SET is_active = TRUE WHERE id = ? AND is_active = FALSE`,
            [id]
        );

        if (result.affectedRows > 0) {
            logger.info(`Doctor with ID ${id} successfully activated.`);
            return true;
        } else {
            logger.warn(`Doctor with ID ${id} was not activated (possibly already active or not found).`);
            return false;
        }
    } catch (error) {
        logger.error(`Failed to activate doctor with ID ${id}. Error: ${error.message}`);
        throw new Error(`Failed to update doctor status: ${error.message}`);
    }
};

export const checkDuplicateDoctor = async (email, phone, id) => {
    try {
        logger.info(`Checking for duplicate doctor with email: ${email}, phone: ${phone}, excluding ID: ${id}`);

        const [rows] = await pool.query(
            "SELECT id FROM doctors WHERE (email = ? OR phone = ?) AND id != ?",
            [email, phone, id]
        );

        if (rows.length > 0) {
            logger.warn(`Duplicate doctor found for email: ${email} or phone: ${phone}`);
            return true;
        }

        logger.info("No duplicate doctor found.");
        return false;
    } catch (error) {
        logger.error(`Database query failed in checkDuplicateDoctor. Error: ${error.message}`);
        throw new Error("Database query failed in checkDuplicateDoctor");
    }
};

export const updateDoctorById = async (id, {
    first_name,
    last_name,
    phone,
    email,
    years_of_experience = 0,
    is_active = true,
    specialties = [],      
    availability = []    
    }) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        logger.info(`Updating doctor with ID: ${id}`);

        // 1. Actualizar datos básicos
        await connection.query(
        `UPDATE doctors SET 
            first_name = COALESCE(?, first_name),
            last_name = COALESCE(?, last_name),
            phone = COALESCE(?, phone),
            email = COALESCE(?, email),
            years_of_experience = COALESCE(?, years_of_experience),
            is_active = COALESCE(?, is_active),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
            first_name,
            last_name,
            phone,
            email,
            years_of_experience,
            is_active,
            id
        ]
        );

        // 2. Actualizar especialidades
        if (Array.isArray(specialties)) {
            await connection.query(
                `DELETE FROM doctor_specialties WHERE doctor_id = ?`,
                [id]
            );

            for (const specialtyName of specialties) {
                const [[specialty]] = await connection.query(
                `SELECT id FROM specialties WHERE name = ? LIMIT 1`,
                [specialtyName]
                );

                if (!specialty) {
                throw new Error(`Specialty "${specialtyName}" not found`);
                }

                await connection.query(
                `INSERT INTO doctor_specialties (doctor_id, specialty_id) VALUES (?, ?)`,
                [id, specialty.id]
                );
            }
        }

        // 3. Actualizar disponibilidad
        if (Array.isArray(availability)) {
            await connection.query(
                `DELETE FROM doctor_schedule WHERE doctor_id = ?`,
                [id]
            );

            const dayMap = {
                Monday: 'mon',
                Tuesday: 'tue',
                Wednesday: 'wed',
                Thursday: 'thu',
                Friday: 'fri',
                Saturday: 'sat',
                Sunday: 'sun',
            };          
    
            for (const slot of availability) {
                const { day, from, to } = slot;
                
                if (!day || !from || !to) {
                    throw new Error(`Invalid availability slot: ${JSON.stringify(slot)}`);
                }
                
                const dbDay = dayMap[day];
                if (!dbDay) {
                    throw new Error(`Invalid day provided in availability: "${day}". Must be a valid weekday name.`);
                }
                
                await connection.query(
                    `INSERT INTO doctor_schedule 
                    (doctor_id, day_of_week, start_time, end_time) 
                    VALUES (?, ?, ?, ?)`,
                    [id, dbDay, from, to]
                );
            }
        }

        await connection.commit();
        logger.info(`Doctor with ID ${id} updated successfully.`);
        return true;

    } catch (error) {
        await connection.rollback();
        logger.error(`Failed to update doctor with ID ${id}. Error: ${error.message}`);
        throw new Error(`Failed to update doctor: ${error.message}`);
    } finally {
        connection.release();
    }
};

export const deleteDoctorById = async (id) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        logger.info(`Attempting to delete doctor with ID: ${id}`);

        // 1. Eliminar disponibilidad
        await connection.query(
        `DELETE FROM doctor_schedule WHERE doctor_id = ?`,
        [id]
        );

        // 2. Eliminar especialidades
        await connection.query(
        `DELETE FROM doctor_specialties WHERE doctor_id = ?`,
        [id]
        );

        // 3. Eliminar doctor
        const [result] = await connection.query(
        `DELETE FROM doctors WHERE id = ?`,
        [id]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            logger.warn(`No doctor found with ID: ${id}, deletion not performed.`);
            return null;
        }

        await connection.commit();
        logger.info(`Doctor with ID: ${id} deleted successfully.`);
        return result;

    } catch (error) {
        await connection.rollback();
        logger.error(`Failed to delete doctor with ID: ${id || "Unknown ID"}. Error: ${error.message}`);
        throw new Error(`Failed to delete doctor: ${error.message}`);
    } finally {
        connection.release();
    }
};