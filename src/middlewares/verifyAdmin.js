import logger from '../config/logger.js';

export const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            logger.warn(`Unauthorized access attempt - No user in request`);
            return next({ status: 401, message: "Unauthorized: No user data" });
        }

        if (req.user.role !== "admin") {
            logger.warn(`Forbidden access - User ID: ${req.user.id} tried to access admin route`);
            return next({ status: 403, message: "Access denied. Admins only" });
        }

        logger.info(`Admin access granted - User ID: ${req.user.id}`);
        next();
    } catch (error) {
        logger.error(`Error in isAdmin middleware: ${error.message}`);
        return next({ status: 500, message: "Internal server error in isAdmin middleware" });
    }
};