import logger from '../config/logger.js';
import { pool } from "../config/db.js";

export const findSocialAccount = async (provider, providerUserId) => {
    try {
        const [rows] = await pool.query('SELECT * FROM social_accounts WHERE provider = ? AND provider_user_id = ?', [provider, providerUserId]);

        if (!Array.isArray(rows) || rows.length === 0) {            
            logger.warn(`No social account found for provider: ${provider}, providerUserId: ${providerUserId}`);
            return null;
        }        
        return rows[0];        
    } catch (error) {        
        logger.error(`Database query failed in findSocialAccount. Error: ${error.message}`);        
        throw new Error("Database query failed in findSocialAccount");    
    }    
};

export const createUser = async ({ username, email, is_active = false }) => {
    try {
        const [result] = await pool.query(
            `INSERT INTO users (username, email, is_active) VALUES (?, ?, ?)`,
            [username, email, is_active]
        );

        if (result.affectedRows === 0) {
            logger.error("Failed to create user: No rows affected.");
            return null;
        }

        const newUser = {
            id: result.insertId,
            username,
            email,
            is_active
        };

        logger.info(`User created successfully with ID: ${result.insertId} and email: ${email}`);
        return newUser;
    } catch (error) {
        logger.error(`Database query failed in createUser. Error: ${error.message}`);
        throw new Error("Database query failed in createUser");
    }
};

export const updateLastLogin = async (user_id) => {
    try {
        await pool.query(`UPDATE users SET last_login = NOW() WHERE id = ?`, [user_id]);
        logger.info(`Updated last_login for user ID: ${user_id}`);
    } catch (error) {
        logger.error(`Database query failed in updateLastLogin. Error: ${error.message}`);
        throw new Error("Database query failed in updateLastLogin");
    }
}

export const createDiscordAccount = async ({
    user_id,
    provider,
    provider_user_id,
    email,
    username,
    global_name,
    avatar
}) => {
    try {
        const [result] = await pool.query(
            `INSERT INTO social_accounts (user_id, provider, provider_user_id, email, username, global_name, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user_id, provider, provider_user_id, email, username, global_name, avatar]
        )

        if (result.affectedRows === 0) {            
            logger.error("Failed to create social account: No rows affected.");
            return null;
        }

        const newSocialAccount = { 
            id: result.insertId,
            avatar
        };

        logger.info(`Social account created successfully with ID: ${result.insertId} via ${provider}`);
        return newSocialAccount;
    } catch (error) {
        logger.error(`Database query failed in createDiscordAccount. Error: ${error.message}`);
        throw new Error("Database query failed in createDiscordAccount");
    }
}