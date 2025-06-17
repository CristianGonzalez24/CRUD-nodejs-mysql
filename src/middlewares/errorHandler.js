import logger from '../config/logger.js';
import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";

    if (err instanceof multer.MulterError) {
        switch (err.code) {
            case 'LIMIT_FILE_SIZE': 
            statusCode = 400;
            message = 'File size limit exceeded';
            break;
            case 'LIMIT_UNEXPECTED_FILE':
            statusCode = 400;
            message = 'Unexpected file type';
            break;
            default:
            statusCode = 400;
            message = 'Error uploading file';
            break;
        }
    }

    logger.error(
        `Error ${statusCode}: ${message} - ${req.method} ${req.originalUrl} - ${req.ip}`
    );

    const errorResponse = {
        message,
        status: statusCode,
        ...(err.details && { details: err.details }),
    };

    res.status(statusCode).json({ error: errorResponse });
};