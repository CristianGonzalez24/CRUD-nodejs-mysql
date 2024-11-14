export const validateSchema = (schema) => (req, res, next) => {
    try {
        const validData = schema.parse(req.body); 
        req.validData = validData; 
        next();
    } catch (error) {
        const formattedErrors = error.errors.map(e => ({
            field: e.path.join('.'), 
            message: e.message,
        }));
        return res.status(400).json({ errors: formattedErrors });
    }
};