import { pool } from "../config/db.js";

export const getActiveDoctors = async (limit, offset) => {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM doctors WHERE is_active = TRUE LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      return rows;
    } catch (error) {
      throw new Error(`Failed to retrieve active doctors. Limit: ${limit}, Offset: ${offset}`);
    }
};

export const countActiveDoctors = async () => {
    try {
      const [result] = await pool.query(
        `SELECT COUNT(*) AS count FROM doctors WHERE is_active = TRUE`
      );
  
      if (!result?.[0]?.count && result?.[0]?.count !== 0) {
        throw new Error("Unexpected result format from database");
      }
  
      return result[0].count || 0;
    } catch (error) {
      throw new Error("Failed to count active doctors");
    }
};

export const getAllDoctorsFromDB = async (limit, offset) => {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM doctors LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      return rows;
    } catch (error) {
      throw new Error(`Failed to retrieve doctors. Limit: ${limit}, Offset: ${offset}`);
    }
};

export const countAllDoctors = async () => {
    try {
      const [result] = await pool.query(
        `SELECT COUNT(*) AS count FROM doctors`
      );

      if (!result?.[0]?.count && result?.[0]?.count !== 0) {
        throw new Error("Unexpected result structure: count is missing");
      }

      return result?.[0]?.count || 0;
    } catch (error) {
      throw new Error("Failed to count doctors in the database");
    }
};

export const findDoctorByEmailOrPhone = async (email, phone) => {
    if (!email && !phone) {
        throw new Error("Both email and phone are missing in findDoctorByEmailOrPhone");
    }

    try {
        const query = `
            SELECT * FROM doctors 
            WHERE (email = ? OR phone = ?) AND is_active = TRUE
        `;
        const [rows = []] = await pool.query(query, [email || null, phone || null]);
        
        if (!Array.isArray(rows)) {
            throw new Error("Unexpected response format from database.");
        }

        return rows;
    } catch (error) {
        throw new Error('Database query failed in findDoctorByEmailOrPhone');
    }
};

export const createDoctorInDB = async (doctor) => {
    try {
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

        if (!result.insertId) {
            return null;
        }
        
        return result.insertId;
    } catch (error) {
        throw new Error("Database query failed in createDoctorInDB");
    }
};

export const getDoctorById = async (id) => {
    if (!id) {
        throw new Error("Doctor ID is required");
    }

    try {
        const [rows] = await pool.query('SELECT * FROM doctors WHERE id = ?', [id]);

        if (!rows || !Array.isArray(rows)) {
            throw new Error("Unexpected database response format");
        }
        
        return rows[0] || null;
    } catch (error) {
        throw new Error(`Failed to retrieve doctor by ID: ${error.message}`);
    }
};

export const deactivateDoctorById = async (id) => {
    try {
        const [result] = await pool.query(
            `UPDATE doctors SET is_active = FALSE WHERE id = ? AND is_active = TRUE`,
            [id]
        );
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error("Failed to update doctor status: " + error.message);
    }
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

