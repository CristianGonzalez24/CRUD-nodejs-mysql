export const validateSchema = (schema) => (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json([{ message: 'Request body is empty' }]);
        }
        const validData = schema.parse(req.body); 
        req.validData = validData; 
        next();
    } catch (error) {
        next({
            message: "Validation error",
            status: 400,
            details: error.errors || error.message,
        });
    }
};
