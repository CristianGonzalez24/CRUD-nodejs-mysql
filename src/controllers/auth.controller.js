import bcrypt from 'bcrypt';
import logger from '../config/logger.js';
import jwt from "jsonwebtoken";
import { promisify } from "util";
import * as am from '../models/auth.model.js';
import { generateTokens } from '../utils/jwt.js';

process.loadEnvFile();

const verifyAsync = promisify(jwt.verify);

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
        const isProduction = process.env.NODE_ENV === "production";

        const user = await am.getUserByEmail(email, { includePassword: true, updateLastLogin: true });
        if (!user) {
            logger.warn(`Login failed: Email not found - ${email}`);
            return next({ 
                status: 401, 
                message: isProduction 
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
                message: isProduction 
                    ? "Invalid email or password" 
                    : "Incorrect password",
            });
        }

        const { accessToken, refreshToken } = await generateTokens(user);

        const cookieMaxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000; // 7 days o 1 hour
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "Strict",
            maxAge: cookieMaxAge,
        });

        logger.info(`User logged in successfully: ${user.email}`);

        res.status(200).json({
            accessToken: accessToken,
            message: "Login successful",
        });

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
            created_at: user.created_at,
            avatar: user.avatar || null
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

export const refreshAccessToken = async (req, res, next) => { 
    try { 
        const token = req.cookies?.refreshToken; 

        if (!token) {
            logger.warn("Unauthorized: No token provided");
            return next({ status: 401, message: "Unauthorized: No token provided" });
        } 

        const decoded = await verifyAsync(token, process.env.REFRESH_TOKEN_SECRET);

        if (!decoded) {
            logger.warn("Unauthorized: Invalid token");
            return next({ status: 401, message: "Unauthorized: Invalid token" });
        } 

        const user = await am.getUserById(decoded.id); 

        if (!user) {
            logger.warn("Unauthorized: User not found");
            return next({ status: 401, message: "Unauthorized: User not found" });
        }
        
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role || 'user'
        };

        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN|| '15m' }
        );

        logger.info(`Access token refreshed for user: ${user.username}`);

        res.status(200).json({ accessToken }); 

    } catch (error) {
        logger.error(`Error refreshing access token: ${error.message}`); 

        if (error.name === 'TokenExpiredError') {
            logger.warn("Unauthorized: Token expired");
            return next({ status: 401, message: "Session expired. Please log in again." });
        }

        if (error.name === 'JsonWebTokenError') {
            logger.warn("Unauthorized: Invalid token");
            return next({ status: 401, message: "Invalid refresh token" });
        }

        return next(error);
    } 
};

export const hasRefreshToken = (req, res) => { 
    const token = req.cookies?.refreshToken;
    return res.json({ hasToken: Boolean(token) });
};