import { pool } from '../db.js'

export const getDoctors = async (req,res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM doctors`)
        res.json(rows)
    } catch (error) {
        return res.status(404).json({message: error.message});
    }
}