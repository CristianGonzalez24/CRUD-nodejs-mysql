import logger from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";

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