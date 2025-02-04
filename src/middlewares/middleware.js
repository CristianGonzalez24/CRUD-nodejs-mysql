export const validateSchema = (schema) => (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
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
        next();
    } catch (error) {
        next({
            message: "Validation error",
            status: 400,
            details: error.errors || [{ message: error.message }],
        });
    }
};