export const errorHandler = (err, req, res, next) => {
    const statusCodes = {
        ValidationError: 400,
        CastError: 400,
        MongoError: err.code === 11000 ? 409 : 500,
        Error: 500,
    };

    const statusCode = statusCodes[err.name] || 500;
    const message = err.name === 'ValidationError' ? 'Validation Error' : 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            message,
            status: statusCode,
            details: err.name === 'ValidationError' ? Object.values(err.errors).map(error => error.message) : null,
        },
    });
};
