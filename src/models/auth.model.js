import logger from '../config/logger.js';
import { pool } from "../config/db.js";

export const checkDuplicateUser = async (email) => {
    try {
        logger.info(`Checking for duplicate user with email: ${email}`);

        const [rows] = await pool.query(
        "SELECT 1 FROM users WHERE email = ? LIMIT 1",
        [email]
        );

        if (rows.length > 0) {
        logger.warn(`Duplicate user found for email: ${email}`);
        return { email: true };
        }

        logger.info("No duplicate user found.");
        return null;

    } catch (error) {
        logger.error(`Database query failed in checkDuplicateUser. Error: ${error.message}`);
        throw new Error("Database query failed in checkDuplicateUser");
    }
};

export const registerUserInDB = async (username, email, password, role) => {    
    try {
        logger.info(`Registering user with username: ${username}, email: ${email}`);

        const [result] = await pool.query(
            `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`, 
            [username, email, password, role]
        );

        if (result.affectedRows === 0) {
            logger.error("Failed to register user: No rows affected.");
            return null;
        }

        const newUser = {
            id: result.insertId,
            username,
            email,
            role
        };

        logger.info(`User registered successfully with ID: ${result.insertId}`);
        return newUser;
    } catch (error) {
        logger.error(`Database query failed in registerUserInDB. Error: ${error.message}`);
        throw new Error("Database query failed in registerUserInDB");
    }
};

export const getUserByEmail = async (email, options = {}) => {
    const {
        includePassword = false,   
        updateLastLogin = false    
    } = options;

    try {
        logger.info(`Fetching user by email: ${email}`);

        const fields = includePassword 
            ? 'id, username, email, password, role, is_active' 
            : 'id, username, email, role, is_active';

        const [rows = []] = await pool.query(
            `SELECT ${fields} FROM users WHERE email = ? LIMIT 1`,
            [email]
        );

        if (!Array.isArray(rows) || rows.length === 0) {
            logger.warn(`No user found with email: ${email}`);
            return null;
        }

        const user = rows[0];

        if (updateLastLogin && user.is_active) {
            await pool.query(`UPDATE users SET last_login = NOW() WHERE id = ?`, [user.id]);
            logger.info(`Updated last_login for user: ${user.email}`);
        }

        logger.info(`Fetched user: ${JSON.stringify({ ...user, password: includePassword ? "HIDDEN" : undefined })}`);
        return user;

    } catch (error) {
        logger.error(`Database query failed in getUserByEmail. Error: ${error.message}`);
        throw new Error("Database query failed in getUserByEmail");
    }
};

export const getUserById = async (id) => {
    try {
        logger.info(`Fetching user by ID: ${id}`);

        const [rows = []] = await pool.query(
            `
            SELECT 
                users.id, 
                users.username, 
                users.email, 
                users.role, 
                users.created_at, 
                users.is_active,
                users.avatar AS local_avatar,
                social_accounts.avatar AS social_avatar
            FROM users
            LEFT JOIN social_accounts ON users.id = social_accounts.user_id
            WHERE users.id = ?
            LIMIT 1
            `,
            [id]
        );

        if (!Array.isArray(rows) || rows.length === 0) {
            logger.warn(`No user found with ID: ${id}`);
            return null;
        }

        const row = rows[0];

        const user = {
            id: row.id,
            username: row.username,
            email: row.email,
            role: row.role,
            created_at: row.created_at,
            is_active: row.is_active,
            avatar: row.local_avatar || row.social_avatar || null,
        };

        logger.info(`Fetched user: ${JSON.stringify(user)}`);
        return user;

    } catch (error) {
        logger.error(`Database query failed in getUserById. Error: ${error.message}`);
        throw new Error("Database query failed in getUserById");
    }
};

export const updateUserStatus = async (id, isActive) => {    
    try {        
        logger.info(`Updating user ${id} status to ${isActive}`);       
        
        const [result] = await pool.query(            
            `UPDATE users SET is_active = ? WHERE id = ?`, 
            [isActive, id]        
        );
        
        if (result.affectedRows === 0) {
            logger.warn(`User ${id} not found`);
            return null;
        }       
        return { id, isActive };
    } catch (error) {        
        logger.error(`Error updating user status: ${error.message}`);
        throw new Error("Database query failed in updateUserStatus");    
    }    
};

export const deleteUserById = async (id) => {    
    try {        
        logger.info(`Deleting user with ID: ${id}`);        
        
        const [result] = await pool.query(            
            `DELETE FROM users WHERE id = ?`, 
            [id]        
        );        
        
        if (result.affectedRows === 0) {            
            logger.warn(`User with ID: ${id} not found`);            
            return null;        
        }        
        return { id };        
    } catch (error) {        
        logger.error(`Error deleting user: ${error.message}`);        
        throw new Error("Database query failed in deleteUserById");    
    }    
};

export const getAllUsers = async () => {    
    try {        
        logger.info("Fetching all users");        
        
        const [rows] = await pool.query(
            "SELECT id, username, email, is_active, last_login FROM users"
        );
        
        if (!Array.isArray(rows) || rows.length === 0) {            
            logger.warn("No users found");            
            return [];        
        }        
        return rows;        
    } catch (error) {        
        logger.error(`Error fetching all users: ${error.message}`);        
        throw new Error("Database query failed in getAllUsers");    
    }    
};

export const updateUserById = async (id, { email, username }) => {    
    try {        
        logger.info(`Updating user with ID: ${id}`);        
        
        const [result] = await pool.query(            
            `UPDATE users SET email = ?, username = ? WHERE id = ?`, 
            [email, username, id]        
        );        
        
        if (result.affectedRows === 0) {            
            logger.warn(`User with ID: ${id} not found`);            
            return null;        
        }        
        return { id, email, username };        
    } catch (error) {        
        logger.error(`Error updating user: ${error.message}`);        
        throw new Error("Database query failed in updateUserById");    
    }
};

export const updateUserPassword = async (id, hashedPassword) => {    
    try {        
        logger.info(`Updating password for user with ID: ${id}`);        
        
        const [result] = await pool.query(            
            `UPDATE users SET password = ? WHERE id = ?`, 
            [hashedPassword, id]        
        );        
        
        if (result.affectedRows === 0) {            
            logger.warn(`User with ID: ${id} not found`);            
            return null;        
        }        
        return { id };        
    } catch (error) {        
        logger.error(`Error updating password: ${error.message}`);        
        throw new Error("Database query failed in updateUserPassword");    
    }    
};

export const getPasswordById = async (id) => {
    try {        
        logger.info(`Fetching password for user with ID: ${id}`);        
        
        const [rows = []] = await pool.query(
            `SELECT password FROM users WHERE id = ? LIMIT 1`, 
            [id]
        );        
        
        if (!Array.isArray(rows) || rows.length === 0) {
            logger.warn(`No user found with ID: ${id}`);            
            return null;
        }        
        return rows[0].password;        
    } catch (error) {        
        logger.error(`Error fetching password: ${error.message}`);        
        throw new Error("Database query failed in getPasswordById");    
    }
}

export const uploadImage = async (userId, imageUrl) => {
    try {        
        logger.info(`Updating avatar for user with ID: ${userId}`);        
        
        const [result] = await pool.query(            
            `UPDATE users SET avatar = ? WHERE id = ?`, 
            [imageUrl, userId]        
        );        
        
        if (result.affectedRows === 0) {            
            logger.warn(`User with ID: ${userId} not found`);            
            return null;        
        }        
        return { userId, imageUrl };        
    } catch (error) {        
        logger.error(`Error updating avatar: ${error.message}`);        
        throw new Error("Database query failed in uploadImage");    
    }
}

export const deleteUserAvatars = async (userId) => {
    try {
        logger.info(`Deleting avatar for user with ID: ${userId}`);

        const [userResult] = await pool.query(
            `UPDATE users SET avatar = NULL WHERE id = ?`,
            [userId]
        );

        const [socialResult] = await pool.query(
            `UPDATE social_accounts SET avatar = NULL WHERE user_id = ?`,
            [userId]
        );

        if (userResult.affectedRows === 0 && socialResult.affectedRows === 0) {
            logger.warn(`User with ID: ${userId} not found in either table`);
            return null;
        }

        return {
            userId,
            userAvatarCleared: userResult.affectedRows > 0,
            socialAvatarCleared: socialResult.affectedRows > 0
        };
    } catch (error) {
        logger.error(`Error deleting avatar(s): ${error.message}`);
        throw new Error("Database query failed in deleteUserAvatars");
    }
};
