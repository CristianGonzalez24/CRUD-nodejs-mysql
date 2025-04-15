import logger from '../config/logger.js';
import { pool } from "../config/db.js";

export const getActiveDoctors = async (limit, offset) => {
    try {
        logger.info(`Fetching active doctors. Limit: ${limit}, Offset: ${offset}`);

        const [rows] = await pool.query(
            `SELECT * FROM doctors WHERE is_active = TRUE LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        logger.info(`Retrieved ${rows.length} active doctors`);
        return rows;
    } catch (error) {
        logger.error(`Failed to retrieve active doctors. Limit: ${limit}, Offset: ${offset}. Error: ${error.message}`);
        throw new Error("Database query failed while fetching active doctors");
    }
};

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

export const getAllDoctorsFromDB = async (limit, offset) => {
    try {
        logger.info(`Fetching all doctors. Limit: ${limit}, Offset: ${offset}`);

        const [rows] = await pool.query(
            `SELECT * FROM doctors LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        logger.info(`Successfully retrieved ${rows.length} doctors.`);
        return rows;
    } catch (error) {
        logger.error(`Failed to retrieve doctors. Limit: ${limit}, Offset: ${offset}. Error: ${error.message}`);
        throw new Error("Database query failed while fetching doctors");
    }
};

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

export const createDoctorInDB = async (doctor) => {
    try {
        logger.info(`Creating new doctor: ${JSON.stringify(doctor)}`);

        const [result] = await pool.query(
            `INSERT INTO doctors (first_name, last_name, specialty, phone, email, years_of_experience, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                doctor.first_name,
                doctor.last_name,
                doctor.specialty,
                doctor.phone,
                doctor.email,
                doctor.years_of_experience || 0,
                true, 
            ]
        );

        if (!result || result.affectedRows === 0) {
            logger.error("Failed to create doctor: No rows affected");
            return null;
        }

        logger.info(`Doctor created successfully with ID: ${result.insertId}`);
        return result.insertId;
    } catch (error) {
        logger.error(`Database query failed in createDoctorInDB. Error: ${error.message}`);
        throw new Error("Database query failed in createDoctorInDB");
    }
};

export const getDoctorById = async (id) => {
    if (!id) {
        logger.warn("Doctor ID is required but was not provided.");
        return null;
    }

    try {
        logger.info(`Fetching doctor with ID: ${id}`);
        const [rows] = await pool.query('SELECT * FROM doctors WHERE id = ?', [id]);
        const doctor = rows[0] || null;

        if (!doctor) {
            logger.warn(`Doctor with ID ${id} not found.`);
            return null;
        }

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
    if (!email && !phone) {
        const errorMsg = "Both email and phone are missing in checkDuplicateDoctor";
        logger.error(errorMsg);
        throw new Error(errorMsg);
    }

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

export const updateDoctorById = async (
    id,
    { first_name, last_name, specialty, phone, email, years_of_experience, is_active }
) => {
    try {
        logger.info(`Updating doctor with ID: ${id}`);

        const [result] = await pool.query(
            `UPDATE doctors SET 
                first_name = COALESCE(?, first_name),
                last_name = COALESCE(?, last_name),
                specialty = COALESCE(?, specialty),
                phone = COALESCE(?, phone),
                email = COALESCE(?, email),
                years_of_experience = COALESCE(?, years_of_experience),
                is_active = COALESCE(?, is_active)
            WHERE id = ?`,
            [
                first_name,
                last_name,
                specialty,
                phone,
                email,
                years_of_experience,
                is_active,
                id,
            ]
        );

        if (result.affectedRows > 0) {
            logger.info(`Doctor with ID: ${id} updated successfully.`);
            return true;
        } else {
            logger.warn(`No changes were made for doctor with ID: ${id}`);
            return false;
        }
    } catch (error) {
        logger.error(`Failed to update doctor with ID: ${id || "Unknown ID"}. Error: ${error.message}`);
        throw new Error(`Failed to update doctor: ${error.message}`);
    }
};

export const deleteDoctorById = async (id) => {
    try {
        logger.info(`Attempting to delete doctor with ID: ${id}`);

        const [result] = await pool.query(
            "DELETE FROM doctors WHERE id = ?",
            [id]
        );

        if (result.affectedRows > 0) {
            logger.info(`Doctor with ID: ${id} deleted successfully.`);
            return result;
        } else {
            logger.warn(`No doctor found with ID: ${id}, deletion not performed.`);
            return null;
        }
    } catch (error) {
        logger.error(`Failed to delete doctor with ID: ${id || "Unknown ID"}. Error: ${error.message}`);
        throw new Error(`Failed to delete doctor: ${error.message}`);
    }
};