import { pool } from '../db.js'

export const getDoctors = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const [rows] = await pool.query(
            `SELECT * FROM doctors WHERE is_active = TRUE LIMIT ? OFFSET ?`,
            [parseInt(limit), parseInt(offset)]
        );

        const [total] = await pool.query(
            `SELECT COUNT(*) AS count FROM doctors WHERE is_active = TRUE`
        );
        const totalDoctors = total[0].count;

        res.json({
            message: 'Active doctors retrieved successfully',
            total: totalDoctors,
            data: rows,
            page: parseInt(page), 
            limit: parseInt(limit),
        });
    } catch (error) {
        next(error);
    }
};

export const getAllDoctors = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const [rows] = await pool.query(
            `SELECT * FROM doctors LIMIT ? OFFSET ?`,
            [parseInt(limit), parseInt(offset)]
        );

        const [total] = await pool.query(
            `SELECT COUNT(*) AS count FROM doctors`
        );
        const totalDoctors = total[0].count;

        res.json({
            message: 'All doctors retrieved successfully',
            total: totalDoctors, 
            data: rows,          
            page: parseInt(page), 
            limit: parseInt(limit), 
        });
    } catch (error) {
        next(error);
    }
};


export const createDoctor = async (req, res, next) => {
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

        res.status(201).json({
            message: 'Doctor created successfully',
            doctor: {
                id: result.insertId,
                ...doctor,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteDoctor = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [existingDoctor] = await pool.query(
            'SELECT * FROM doctors WHERE id = ?',
            [id]
        );

        if (existingDoctor.length === 0) {
            return res.status(404).json({
                message: 'Doctor not found',
            });
        }

        const [result] = await pool.query(
            'DELETE FROM doctors WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({
                message: 'Failed to delete the doctor',
            });
        }

        res.status(200).json({
            message: 'Doctor deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const deactivateDoctor = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            `UPDATE doctors SET is_active = FALSE WHERE id = ? AND is_active = TRUE`,
            [id]
        );

        if (result.affectedRows === 0) {
            const error = new Error('Doctor not found or already inactive');
            error.status = 404;
            throw error;
        }

        res.status(200).json({ message: 'Doctor marked as inactive successfully' });
    } catch (error) {
        next(error);
    }
};

export const activateDoctor = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            `UPDATE doctors SET is_active = TRUE WHERE id = ? AND is_active = FALSE`,
            [id]
        );

        if (result.affectedRows === 0) {
            const error = new Error('Doctor not found or already active');
            error.status = 404;
            throw error;
        }

        res.status(200).json({ message: 'Doctor reactivated successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateDoctor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, specialty, phone, email, years_of_experience } = req.body;

        const [existingDoctor] = await pool.query(
            'SELECT * FROM doctors WHERE id = ?',
            [id]
        );

        if (existingDoctor.length === 0) {
            return res.status(404).json({
                message: 'Doctor not found',
            });
        }

        if (email) {
            const [emailCheck] = await pool.query(
                'SELECT id FROM doctors WHERE email = ? AND id != ?',
                [email, id]
            );

            if (emailCheck.length > 0) {
                return res.status(400).json({
                    message: 'Email already in use by another doctor',
                });
            }
        }

        if (phone) {
            const [phoneCheck] = await pool.query(
                'SELECT id FROM doctors WHERE phone = ? AND id != ?',
                [phone, id]
            );

            if (phoneCheck.length > 0) {
                return res.status(400).json({
                    message: 'Phone number already in use by another doctor',
                });
            }
        }

        const [result] = await pool.query(
            `UPDATE doctors SET 
                first_name = COALESCE(?, first_name),
                last_name = COALESCE(?, last_name),
                specialty = COALESCE(?, specialty),
                phone = COALESCE(?, phone),
                email = COALESCE(?, email),
                years_of_experience = COALESCE(?, years_of_experience)
            WHERE id = ?`,
            [first_name, last_name, specialty, phone, email, years_of_experience, id]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({
                message: 'Failed to update the doctor',
            });
        }

        res.status(200).json({
            message: 'Doctor updated successfully',
            updatedDoctor: { id, first_name, last_name, specialty, phone, email, years_of_experience },
        });
    } catch (error) {
        next(error);
    }
};


