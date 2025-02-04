export const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";

    console.error(`Error [${statusCode}]: ${message}`);

    const errorResponse = {
        message,
        status: statusCode,
        ...(err.details && { details: err.details })
    };

    res.status(statusCode).json({ error: errorResponse });
};
