import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { doctorDocs } from "./paths/doctors.docs.js";
import { authDocs } from "./paths/auth.docs.js";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hospital API',
            version: '1.0.0',
            description: 'API documentation for Hospital Management System'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                Doctor: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        first_name: { type: 'string', example: 'Juan' },
                        last_name: { type: 'string', example: 'Pérez' },
                        specialty: { type: 'string', example: 'Cardiology' },
                        phone: { type: 'string', example: '123-456-7890' },
                        email: { type: 'string', example: 'juan.perez@example.com' },
                        years_of_experience: { type: 'integer', example: 10 },
                        is_active: { type: 'boolean', example: true },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        username: { type: 'string', example: 'john' },
                        email: { type: 'string', example: 'johndoe@example.com' },
                        role: { type: 'string', example: 'user' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        status: { type: 'integer' },
                    },
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Username or email already taken' },
                        status: { type: 'integer', example: 400 },
                        details: {
                            type: 'object',
                            properties: {
                                username: { type: 'boolean', example: true },
                                email: { type: 'boolean', example: true },
                            },
                        },
                    },
                },
                ZodValidationError: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'object',
                            properties: {
                                message: { type: 'string', example: 'Validation error' },
                                status: { type: 'integer', example: 400 },
                                details: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            code: { type: 'string', example: 'invalid_type' },
                                            expected: { type: 'string', example: 'string' },
                                            received: { type: 'string', example: 'undefined' },
                                            path: { type: 'array', items: { type: 'string' }, example: ['userName'] },
                                            message: { type: 'string', example: 'Username is required' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                toggleUserSchema: { 
                    type: 'object', 
                    properties: {
                        is_active: { type: 'boolean', example: true },
                    }, 
                },
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
        paths: {},
    },
    apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

swaggerSpec.paths = {
    ...swaggerSpec.paths,
    ...doctorDocs,
    ...authDocs,
};


const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;