import logger from '../config/logger.js';

export const validateSchema = (schema) => (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            logger.warn(`Validation failed: Request body is empty (Path: ${req.originalUrl})`);
            return res.status(400).json({
                error: {
                    message: "Request body is empty",
                    status: 400,
                    details: null,
                },
            });
        }

        const validData = schema.parse(req.body);
        req.body = validData;

        logger.info(`Validation successful for ${req.originalUrl}`);
        next();
    } catch (error) {
        logger.error(`Validation error on ${req.originalUrl}: ${JSON.stringify(error.errors)}`);

        next({
            message: "Validation error",
            status: 400,
            details: error.errors || [{ message: error.message }],
        });
    }
};