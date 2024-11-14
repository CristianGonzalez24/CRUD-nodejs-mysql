import { pool } from '../db.js'

export const getDoctors = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const [rows] = await pool.query(
            `SELECT * FROM doctors LIMIT ? OFFSET ?`,
            [parseInt(limit), parseInt(offset)]
        );

        res.json({
            message: 'Doctors retrieved successfully',
            data: rows,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while fetching the doctors',
            error: error.message,
        });
    }
};

export const createDoctor = async (req, res) => {
    try {
        const doctor = req.validData;

        const [existingDoctor] = await pool.query(
            `SELECT * FROM doctors WHERE email = ? OR phone = ?`,
            [doctor.email, doctor.phone]
        );

        if (existingDoctor.length > 0) {
            return res.status(400).json({ message: 'Doctor with this email or phone already exists' });
        }

        const [result] = await pool.query(
            `INSERT INTO doctors (first_name, last_name, specialty, phone, email, years_of_experience)
                VALUES (?, ?, ?, ?, ?, ?)`,
            [
                doctor.first_name,
                doctor.last_name,
                doctor.specialty,
                doctor.phone,
                doctor.email,
                doctor.years_of_experience,
            ]
        );

        // Responde con el ID generado
        res.status(201).json({
            message: 'Doctor created successfully',
            doctor: {
                id: result.insertId,
                ...doctor,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'An error occurred while creating the doctor',
            error: error.message,
        });
    }
};