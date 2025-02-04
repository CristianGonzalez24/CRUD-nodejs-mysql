import { jest } from '@jest/globals';
import { validateSchema } from '../middlewares/middleware.js';
import { doctorSchema } from '../validators/doctor.schema.js';

describe("validateSchema Middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} }; 
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    it("should call next if request body is valid", () => {
        req.body = {
            first_name: "John",
            last_name: "Doe",
            specialty: "Cardiology",
            email: "john.doe@example.com",
            years_of_experience: 5,
            is_active: true
        };
    
        validateSchema(doctorSchema)(req, res, next);
    
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
    
    it("should return 400 if request body is empty", () => {
        validateSchema(doctorSchema)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                message: "Request body is empty",
                status: 400,
                details: null,
            },
        }); 
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 400 if request body is invalid", () => {
        req.body = {
            first_name: "J",
            last_name: "",
            specialty: "C", 
            email: "not-an-email" 
        };
    
        const errorHandler = (err, req, res, next) => { // errorHandler simulated
            res.status(err.status || 500).json({
                error: {
                    message: err.message,
                    status: err.status,
                    details: err.details,
                },
            });
        };
    
        validateSchema(doctorSchema)(req, res, (err) => errorHandler(err, req, res, next));

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({
                    message: "Validation error",
                    status: 400,
                    details: expect.any(Array),
                }),
            })
        );
        expect(next).not.toHaveBeenCalled();
    });
    
    it("should overwrite req.body with the validated data", () => {
        req.body = {
            first_name: "Alice",
            last_name: "Smith",
            specialty: "Neurology",
            email: "alice.smith@example.com",
            years_of_experience: 10,
            is_active: true,
        };
    
        validateSchema(doctorSchema)(req, res, next);
    
        expect(req.body).toEqual({
            first_name: "Alice",
            last_name: "Smith",
            specialty: "Neurology",
            email: "alice.smith@example.com",
            years_of_experience: 10,
            is_active: true,
        });
    
        expect(next).toHaveBeenCalled();
    });    
});