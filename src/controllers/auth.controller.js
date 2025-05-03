import bcrypt from 'bcrypt';
import logger from '../config/logger.js';
import * as am from '../models/auth.model.js';
import { generateToken } from '../utils/jwt.js';

process.loadEnvFile();

export const registerUser = async (req, res, next) => {   
    const { username, email, password, role } = req.validData;

    if (!username || !email || !password) {    
        logger.warn(`Invalid registration data received`);    
        return next({ status: 400, message: "Invalid registration data" });    
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const existingFields = await am.checkDuplicateUser(email);
        if (existingFields !== null) {
            logger.warn(`Email already taken: ${email}`);
            return next({
                status: 400,
                message: "Email already taken",
                details: existingFields,
            });
        }

        const isAdminRoute = req.originalUrl.endsWith('/admin/register');

        const role = (isAdminRoute && req.validData.role === 'admin')
        ? 'admin'
        : 'user';

        const newUser = await am.registerUserInDB(username, email, hashedPassword, role);
        if (!newUser) {
            logger.error("User registration failed");
            return next({ status: 500, message: "User registration failed" });
        }

        logger.info(`User registered successfully: ${JSON.stringify(newUser)}`);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        logger.error(`Error registering user: ${error.message}`);
        return next(error);        
    }
};

export const loginUser = async (req, res, next) => {   
    const { email, password, rememberMe } = req.validData;

    if (!email || !password) {    
        logger.warn(`Invalid login data received`);    
        return next({ message: "Invalid login data", status: 400 });    
    }

    try {
        const environment = process.env.NODE_ENV || 'development';

        const user = await am.getUserByEmail(email, { includePassword: true, updateLastLogin: true });
        if (!user) {
            logger.warn(`Login failed: Email not found - ${email}`);
            return next({ 
                status: 401, 
                message: environment === 'production' 
                    ? "Invalid email or password" 
                    : "Email not found",
            });
        }

        if(!user.is_active) {            
            logger.warn(`Login failed: User is inactive - ${email}`);             
            return next({ status: 403, message: "Account is inactive. Contact support." });      
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Login failed: Incorrect password for email - ${email}`);
            return next({ 
                status: 401, 
                message: environment === 'production' 
                    ? "Invalid email or password" 
                    : "Incorrect password",
            });
        }

        const token = await generateToken(user);

        const cookieMaxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
        res.cookie("token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Strict", 
            maxAge: cookieMaxAge, 
        });

        logger.info(`User logged in successfully: ${user.email}`);

        res.status(200).json({ message: "Login successful" });

    } catch (error) {
        logger.error(`Error logging in user: ${error.message}`);
        return next(error);
    }
};

export const logoutUser = (req, res, next) => {   
    try {
        res.cookie("token", "", { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Strict", 
            expires: new Date(0) 
        });

        logger.info("User logged out successfully");

        res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        logger.error(`Error logging out user: ${error.message}`);
        return next(error);
    }
};

export const getProfile = async (req, res, next) => {   
    try {
        const userId = req.user.id;

        const user = await am.getUserById(userId); 
        if (!user) {    
            logger.warn(`User not found for user ID: ${userId}`);    
            return next({ status: 404, message: "User not found" });    
        }
            
        logger.info(`Fetched user profile for user ID: ${userId}`);

        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        });

    } catch (error) {
        logger.error(`Error fetching profile: ${error.message}`);
        return next(error);
    }
};

export const getAllUsers = async (req, res, next) => { 
    try {      
        const users = await am.getAllUsers(); 
        if(!users.length) {
            logger.warn("No users found");
            return next({ status: 404, message: "No users found" });
        }

        logger.info("Retrieved all users successfully");

        res.status(200).json(users);
    } catch (error) { 
        logger.error(`Error fetching all users: ${error.message}`); 
        return next(error); 
    }
};

export const toggleUserStatus = async (req, res, next) => { 
    try {
        const id = Number(req.params.id);
        const { is_active } = req.validData;

        if (!Number.isInteger(id) || id <= 0) {    
            logger.warn(`Invalid user ID: ${id}`);    
            return next({ status: 400, message: "Invalid user ID" });    
        }

        const result = await am.updateUserStatus(id, is_active);

        if (!result) {    
            logger.warn(`User not found for user ID: ${id}`);    
            return next({ status: 404, message: "User not found" });    
        } 

        logger.info(`Updated user status for user ID: ${id}`); 

        res.status(200).json({ message: `User ${is_active ? "activated" : "deactivated"} successfully` });

    } catch (error) { 
        logger.error(`Error updating user status: ${error.message}`); 
        return next(error);
    }
};

export const deleteUser = async (req, res, next) => { 
    try { 
        const id = Number(req.params.id); 

        if (!Number.isInteger(id) || id <= 0) {    
            logger.warn(`Invalid user ID: ${id}`);    
            return next({ status: 400, message: "Invalid user ID" });    
        } 

        const result = await am.deleteUserById(id); 

        if (!result) {    
            logger.warn(`User not found for user ID: ${id}`);    
            return next({ status: 404, message: "User not found" });    
        } 

        logger.info(`Deleted user ID: ${id}`); 

        res.status(200).json({ message: "User deleted successfully" }); 

    } catch (error) {
        logger.error(`Error deleting user: ${error.message}`); 
        return next(error);
    }
};

export const updateUser = async (req, res, next) => { 
    try { 
        const id = Number(req.params.id); 
        const updatedFields  = req.validData;

        if (!Number.isInteger(id) || id <= 0) {    
            logger.warn(`Invalid user ID: ${id}`);    
            return next({ status: 400, message: "Invalid user ID" });    
        }

        const result = await am.updateUserById(id, updatedFields); 

        if (!result) {    
            logger.warn(`User not found for user ID: ${id}`);    
            return next({ status: 404, message: "User not found" });    
        } 

        logger.info(`Updated user ID: ${id}`); 

        res.status(200).json({ message: "User updated successfully" }); 

    } catch (error) {
        logger.error(`Error updating user: ${error.message}`); 
        return next(error);
    }
};

export const updateUserPassword = async (req, res, next) => { 
    try { 
        const id = Number(req.params.id); 
        const { current_password, new_password } = req.validData;

        if (!Number.isInteger(id) || id <= 0) {    
            logger.warn(`Invalid user ID: ${id}`);    
            return next({ status: 400, message: "Invalid user ID" });    
        } 

        const userPassword = await am.getPasswordById(id); 

        if (!userPassword) {
            logger.error(`Password hash not found for user ID: ${id}`);
            return next({ status: 500, message: "User data is corrupted" });
        }

        const passwordMatch = await bcrypt.compare(current_password, userPassword); 

        if (!passwordMatch) {
            logger.warn(`Incorrect current password for user ID: ${id}`);    
            return next({ status: 401, message: "Incorrect current password" });
        } 

        if(new_password === current_password) {    
            logger.warn(`New password cannot be the same as the current password for user ID: ${id}`);    
            return next({ status: 400, message: "New password cannot be the same as the current password" });    
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);

        const result = await am.updateUserPassword(id, hashedPassword);

        if (!result) { 
            logger.error(`Failed to update password for user ID: ${id}`);    
            return next({ status: 500, message: "Failed to update password" });    
        } 

        logger.info(`Updated password for user ID: ${id}`); 

        res.status(200).json({ message: "Password updated successfully" }); 

    } catch (error) {
        logger.error(`Error updating password: ${error.message}`); 
        return next(error);
    }
};