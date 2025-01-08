import { pool } from "../config/db.js";

export const getActiveDoctors = async (limit, offset) => {
    const [rows] = await pool.query(
        `SELECT * FROM doctors WHERE is_active = TRUE LIMIT ? OFFSET ?`,
        [limit, offset]
    );
    return rows.length ? rows : [];
};


export const countActiveDoctors = async () => {
    const [total] = await pool.query(
        `SELECT COUNT(*) AS count FROM doctors WHERE is_active = TRUE`
    );
    return total[0].count;
};

export const getAllDoctorsFromDB = async (limit, offset) => {
    const [rows] = await pool.query(
        `SELECT * FROM doctors LIMIT ? OFFSET ?`,
        [limit, offset]
    );
    return rows.length ? rows : [];
};

export const countAllDoctors = async () => {
    const [total] = await pool.query(
        `SELECT COUNT(*) AS count FROM doctors`
    );
    return total[0].count;
};

export const findDoctorByEmailOrPhone = async (email, phone) => {
    const [rows] = await pool.query(
        `SELECT * FROM doctors WHERE email = ? OR phone = ?`,
        [email, phone]
    );
    return rows.length ? rows : [];
};

export const createDoctorInDB = async (doctor) => {
    const [result] = await pool.query(
        `INSERT INTO doctors (first_name, last_name, specialty, phone, email, years_of_experience, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
        doctor.first_name,
        doctor.last_name,
        doctor.specialty,
        doctor.phone,
        doctor.email,
        doctor.years_of_experience,
        true,
        ]
    );
    return result.insertId;
};

export const getDoctorById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM doctors WHERE id = ?', [id]);
    return rows.length ? rows : [];
};

export const deactivateDoctorById = async (id) => {
    const [result] = await pool.query(
        `UPDATE doctors SET is_active = FALSE WHERE id = ? AND is_active = TRUE`,
        [id]
    );
    return result;
};

export const activateDoctorById = async (id) => {
    const [result] = await pool.query(
        `UPDATE doctors SET is_active = TRUE WHERE id = ? AND is_active = FALSE`,
        [id]
    );
    return result;
};

export const checkDuplicateDoctor = async (email, phone, id) => {
    const [rows] = await pool.query(
        "SELECT id FROM doctors WHERE (email = ? OR phone = ?) AND id != ?",
        [email, phone, id]
    );
    return rows.length > 0;
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
    return result;
};

export const deleteDoctorById = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM doctors WHERE id = ?",
        [id]
    );
    return result;
};