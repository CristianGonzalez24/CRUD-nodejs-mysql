import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

process.loadEnvFile();

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token; 

        if (!token) {
            logger.warn("Unauthorized: No token provided");
            return next({ status: 401, message: "Unauthorized: No token provided" });
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        logger.info(`Token verified for user: ${decoded.username}`);
        next();
    } catch (error) {
        logger.error(`Invalid token: ${error.message}`);
        return next({ status: 403, message: "Forbidden: Invalid token" });
    }
};