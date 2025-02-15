import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { doctorDocs } from "../docs/swaggerDocs.js";

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
            },
        },
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

swaggerSpec.paths = {
    ...swaggerSpec.paths, 
    ...doctorDocs, 
};

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;