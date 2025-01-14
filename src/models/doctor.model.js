import { pool } from "../config/db.js";

export const getActiveDoctors = async (limit, offset) => {
    if (!Number.isInteger(limit) || !Number.isInteger(offset) || limit < 0 || offset < 0) {
        throw new Error("Limit and offset must be non-negative integers");
    }
    const [rows] = await pool.query(
        `SELECT * FROM doctors WHERE is_active = TRUE LIMIT ? OFFSET ?`,
        [limit, offset]
    );
    return rows;
};

export const countActiveDoctors = async () => {
    try {
        const [result] = await pool.query(
            `SELECT COUNT(*) AS count FROM doctors WHERE is_active = TRUE`
        );
        return result?.[0]?.count || 0;
    } catch (error) {
        throw new Error("Failed to count active doctors");
    }
};

export const getAllDoctorsFromDB = async (limit, offset) => {
    if (!Number.isInteger(limit) || !Number.isInteger(offset) || limit < 0 || offset < 0) {
        throw new Error("Limit and offset must be non-negative integers");
    }

    try {
        const [rows] = await pool.query(
            `SELECT * FROM doctors LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        return rows;
    } catch (error) {
        throw new Error("Failed to retrieve doctors from the database");
    }
};

export const countAllDoctors = async () => {
    try {
        const [result] = await pool.query(
            `SELECT COUNT(*) AS count FROM doctors`
        );
        return result?.[0]?.count || 0;
    } catch (error) {
        throw new Error("Failed to count all doctors");
    }
};

export const findDoctorByEmailOrPhone = async (email, phone) => {
    if (!email && !phone) {
        throw new Error("Either email or phone must be provided");
    }

    try {
        const [rows] = await pool.query(
            `SELECT * FROM doctors WHERE email = ? OR phone = ?`,
            [email, phone]
        );
        return rows.length ? rows : [];
    } catch (error) {
        throw new Error("Failed to find doctor by email or phone");
    }
};

export const createDoctorInDB = async (doctor) => {
    if (!doctor) {
        throw new Error("Cannot create doctor: doctor object is null or undefined");
    }

    const {
        first_name,
        last_name,
        specialty,
        phone,
        email,
        years_of_experience,
    } = doctor;

    if (!first_name || !last_name || !specialty) {
        throw new Error("Cannot create doctor: first name, last name, and specialty are required");
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO doctors (first_name, last_name, specialty, phone, email, years_of_experience, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                first_name,
                last_name,
                specialty,
                phone,
                email,
                years_of_experience,
                true,
            ]
        );

        if (!result.insertId) {
            throw new Error("Failed to create doctor: insertId is null or undefined");
        }

        return result.insertId;
    } catch (error) {
        throw new Error("Failed to create doctor");
    }
};

export const getDoctorById = async (id) => {
    if (!id) {
        throw new Error("Doctor ID is required");
    }

    const [doctor] = await pool.query('SELECT * FROM doctors WHERE id = ?', [id]);
    return doctor || [];
};

export const deactivateDoctorById = async (id) => {
    if (!id) {
        throw new Error("Doctor ID is required");
    }

    const [result] = await pool.query(
        `UPDATE doctors SET is_active = FALSE WHERE id = ? AND is_active = TRUE`,
        [id]
    );

    if (result.affectedRows === 0) {
        throw new Error("Failed to deactivate doctor");
    }

    return result;
};

export const activateDoctorById = async (id) => {
    if (!id) {
        throw new Error("Doctor ID is required");
    }

    const [result] = await pool.query(
        `UPDATE doctors SET is_active = TRUE WHERE id = ? AND is_active = FALSE`,
        [id]
    );
        
    if (result.affectedRows === 0) {
        throw new Error("Failed to activate doctor");
    }

    return result;
};

export const checkDuplicateDoctor = async (email, phone, id) => {
    if (!id) {
        throw new Error("Doctor ID is required");
    }

    if (!email && !phone) {
        throw new Error("Either email or phone must be provided");
    }

    const [rows] = await pool.query(
        "SELECT id FROM doctors WHERE (email = ? OR phone = ?) AND id != ?",
        [email, phone, id]
    );

    return rows.length > 0;
};

export const deleteDoctorById = async (id) => {
    if (!id) {
        throw new Error("Doctor ID is required");
    }

    const [result] = await pool.query(
        "DELETE FROM doctors WHERE id = ?",
        [id]
    );
        
    if (result.affectedRows === 0) {
        throw new Error("Failed to delete doctor");
    }

    return result;
};

export const updateDoctorById = async (
    id,
    {
        first_name,
        last_name,
        specialty,
        phone,
        email,
        years_of_experience,
        is_active,
    }
) => {
    if (!id) {
        throw new Error("Doctor ID is required");
    }

    try {
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

        if (result.affectedRows === 0) {
            throw new Error("Failed to update doctor: doctor not found or no changes made");
        }

        return result;
    } catch (error) {
        throw new Error("Failed to update doctor");
    }
};

