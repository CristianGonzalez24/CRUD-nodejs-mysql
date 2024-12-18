export const validateSchema = (schema) => (req, res, next) => {
    try {
        const validData = schema.parse(req.body); 
        req.validData = validData; 
        next();
    } catch (error) {
        return res.status(400).json(error.errors.map(e => e.message));
    }
};