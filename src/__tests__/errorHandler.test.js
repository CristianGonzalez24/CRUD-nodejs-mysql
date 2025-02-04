import request from 'supertest';
import express from 'express';
import { errorHandler } from '../middlewares/errorHandler.js';

describe('errorHandler', () => {
    it("should handle an error with a defined status code", async () => {
        const app = express();
        app.use((req, res, next) => {
            const error = new Error("Test error");
            error.status = 400;
            error.details = { field: "email", message: "Invalid email format" };
            next(error);
        });
        app.use(errorHandler);

        const response = await request(app).get("/");
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: {
                message: "Test error",
                status: 400,
                details: { field: "email", message: "Invalid email format" },
            },
        });
    });

    it("should default to 500 if no status code is provided", async () => {
        const app = express();
        app.use((req, res, next) => {
            const error = new Error("Unexpected error");
            next(error);
        });
        app.use(errorHandler);
    
        const response = await request(app).get("/");

        expect(response.status).toBe(500);
        expect(response.body.error.message).toBe("Unexpected error");
    });

    it("should not include details if not present in error object", async () => {
        const app = express();
        app.use((req, res, next) => {
            const error = new Error("Error without details");
            error.status = 403;
            next(error);
        });
        app.use(errorHandler);

        const response = await request(app).get("/");

        expect(response.status).toBe(403);
        expect(response.body).toEqual({
            error: {
                message: "Error without details",
                status: 403,
            },
        });
    });
});
