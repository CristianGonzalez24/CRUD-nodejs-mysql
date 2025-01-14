export const validateSchema = (schema) => (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).json([{ message: 'Request body is empty' }]);
        }
        const validData = schema.parse(req.body); 
        req.validData = validData; 
        next();
    } catch (error) {
        if (error.errors) {
            return res.status(400).json(error.errors.map(e => e.message));
        }
        return res.status(500).json([{ message: 'Internal Server Error' }]);
    }
};
