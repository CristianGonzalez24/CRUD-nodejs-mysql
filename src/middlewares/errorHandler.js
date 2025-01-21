export const errorHandler = (err, req, res, next) => {
    try {
        const statusCode = err.status || 500;
        const message = err.message || 'Internal Server Error';

        res.status(statusCode).json({
            error: {
                message: message,
                status: statusCode,
                details: err.details || null, 
            },
        });
    } catch (loggingError) {
        console.error('Failed to handle error properly:', loggingError);
        res.status(500).json({
            error: {
                message: 'Unexpected error occurred',
                status: 500,
                details: null,
            },
        });
    }
};