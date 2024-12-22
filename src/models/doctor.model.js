import { pool } from "../config/db.js";

export const getActiveDoctors = async (limit, offset) => {
    const [rows] = await pool.query(
        `SELECT * FROM doctors WHERE is_active = TRUE LIMIT ? OFFSET ?`,
    [limit, offset]
    );
    return rows;
};

export const countActiveDoctors = async () => {
    const [total] = await pool.query(
        `SELECT COUNT(*) AS count FROM doctors WHERE is_active = TRUE`
    );
    return total[0].count;
};

export const getAllDoctors = async (limit, offset) => {
    const [rows] = await pool.query(
        `SELECT * FROM doctors LIMIT ? OFFSET ?`,
        [limit, offset]
    );
    return rows;
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
    return rows;
};

export const createDoctor = async (doctor) => {
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
    const [rows] = await pool.query(
        `SELECT * FROM doctors WHERE id = ?`,
        [id]
    );
    return rows[0];
};