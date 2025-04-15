import logger from "../config/logger.js";

export const verifyUserId = (req, res, next) => { 
    try { 
        const userIdFromToken = req.user?.id;
        const userIdFromParams = Number(req.params.id);

        if (!Number.isInteger(userIdFromParams) || userIdFromParams <= 0) {    
            logger.warn(`Invalid user ID: ${userIdFromParams}`);    
            return next({ status: 400, message: "Invalid user ID" });    
        }

        if (userIdFromToken !== userIdFromParams) {
            logger.warn(`Unauthorized access attempt - User ID mismatch: ${userIdFromToken} !== ${userIdFromParams}`); 
            return next({ status: 403, message: "Unauthorized: User ID mismatch" });
        } 

        logger.info(`Verified user ID: ${userIdFromParams}`); 
        next(); 
    } catch (error) {
        logger.error(`Error in verifyUserId middleware: ${error.message}`); 
        return next({ status: 500, message: "Internal server error in verifyUserId middleware" });
    } 
};