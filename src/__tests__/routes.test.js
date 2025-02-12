import { jest } from '@jest/globals';
import request from "supertest";

jest.unstable_mockModule("../controllers/doctors.controller.js", () => ({
    getDoctors: jest.fn((req, res) => res.status(200).json([{ id: 1, first_name: "John", last_name: "Doe" }])),
    getAllDoctors: jest.fn((req, res) => res.status(200).json([{ id: 1, first_name: "John", last_name: "Doe" }])),
    createDoctor: jest.fn((req, res) => res.status(201).json({ message: "Doctor created successfully", doctor: req.body })),
    updateDoctor: jest.fn((req, res) => res.status(200).json({ message: "Doctor updated successfully", doctor: { id: req.params.id, ...req.body }})),
    deleteDoctor: jest.fn((req, res) => res.status(200).json({ message: "Doctor deleted successfully" })),
    deactivateDoctor: jest.fn((req, res) => res.status(200).json({ message: "Doctor deactivated successfully" })),
    activateDoctor: jest.fn((req, res) => res.status(200).json({ message: "Doctor activated successfully" })),
}));

const dc = await import("../controllers/doctors.controller.js");
const { default: app } = await import("../__mocks__/mockApp.js");

describe("Doctors routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    const mockDoctors = [
        { id: 1, first_name: "John", last_name: "Doe" },
        { id: 2, first_name: "Jane", last_name: "Smith" },
        { id: 3, first_name: "Alice", last_name: "Johnson" }
    ];

    const validDoctor = {
        first_name: "John",
        last_name: "Doe",
        specialty: "Cardiology",
        phone: "123456789",
        email: "johndoe@example.com",
        years_of_experience: 5,
        is_active: true
    };

    const updatedDoctor = {
        first_name: "Updated",
        last_name: "Doctor",
        specialty: "Cardiology",
        phone: "1234567890",
        email: "updated@example.com",
    };
    const doctorId = 1;
    const invalidDoctorId = 9999;

    describe("GET /api/doctors", () => {
        it("should call getDoctors mock and return expected response", async () => {
            const response = await request(app).get("/api/doctors");
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([{ id: 1, first_name: "John", last_name: "Doe" }]);
            expect(response.body).toHaveLength(1);
            expect(dc.getDoctors).toHaveBeenCalledTimes(1);
        });

        it("should return an empty array when no doctors are available", async () => {
            dc.getDoctors.mockImplementation((req, res) => res.status(200).json([]));
        
            const response = await request(app).get("/api/doctors");
        
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
            expect(response.body).toHaveLength(0);
            expect(dc.getDoctors).toHaveBeenCalledTimes(1);
        });
        
        it("should return multiple doctors when the controller responds with a list", async () => {
            dc.getDoctors.mockImplementation((req, res) => res.status(200).json(mockDoctors));
        
            const response = await request(app).get("/api/doctors");
        
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockDoctors);
            expect(response.body).toHaveLength(3);
            expect(dc.getDoctors).toHaveBeenCalledTimes(1);
        }); 

        it("should return 500 when the controller throws an error", async () => {
            dc.getDoctors.mockImplementation((req, res, next) => {
                next(new Error("Database connection failed"));
            });
        
            const response = await request(app).get("/api/doctors");
        
            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("error.message", "Database connection failed");
            expect(response.body).toHaveProperty("error.status", 500);
            expect(dc.getDoctors).toHaveBeenCalledTimes(1);
        });
    });

    describe("GET /api/doctors/all", () => {
        it("should return a single doctor when the controller responds with one", async () => {
            const response = await request(app).get("/api/doctors/all");
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([{ id: 1, first_name: "John", last_name: "Doe" }]);
            expect(response.body).toHaveLength(1);
            expect(dc.getAllDoctors).toHaveBeenCalledTimes(1);
        });

        it("should return an empty array when no doctors are available", async () => {
            dc.getAllDoctors.mockImplementation((req, res) => res.status(200).json([]));
    
            const response = await request(app).get("/api/doctors/all");
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual([]);
            expect(response.body).toHaveLength(0);
            expect(dc.getAllDoctors).toHaveBeenCalledTimes(1);
        });

        it("should return multiple doctors when the controller responds with a list", async () => {
            dc.getAllDoctors.mockImplementation((req, res) => res.status(200).json(mockDoctors));
    
            const response = await request(app).get("/api/doctors/all");
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual(mockDoctors);
            expect(response.body).toHaveLength(3);
            expect(dc.getAllDoctors).toHaveBeenCalledTimes(1);
        });
        
        it("should return an error response when the controller throws an error", async () => {
            dc.getAllDoctors.mockImplementation((req, res, next) => {
                next(new Error("Internal Server Error"));
            });
    
            const response = await request(app).get("/api/doctors/all");
    
            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("error.message", "Internal Server Error");
            expect(response.body).toHaveProperty("error.status", 500);
            expect(dc.getAllDoctors).toHaveBeenCalledTimes(1);
        });
    });

    describe("POST /api/doctors", () => {
        it("should create a doctor when valid data is sent", async () => {
            const response = await request(app)
                .post("/api/doctors")
                .send(validDoctor)
                .set("Content-Type", "application/json");
    
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty("message", "Doctor created successfully");
            expect(response.body).toHaveProperty("doctor");
            expect(response.body.doctor).toEqual(validDoctor);
            expect(dc.createDoctor).toHaveBeenCalledTimes(1);
        });

        it("should return a 400 error when a required field is missing", async () => {
            const invalidDoctor = { ...validDoctor };
            delete invalidDoctor.first_name;
    
            const response = await request(app)
                .post("/api/doctors")
                .send(invalidDoctor)
                .set("Content-Type", "application/json");
    
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty("error.message");
            expect(response.body.error.message).toContain("Validation error");
            expect(dc.createDoctor).not.toHaveBeenCalled();
        });

        it("should return a 400 error when a field has an incorrect format", async () => {
            const invalidDoctor = { ...validDoctor, email: "invalid-email" };
    
            const response = await request(app)
                .post("/api/doctors")
                .send(invalidDoctor)
                .set("Content-Type", "application/json");
    
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty("error.message");
            expect(response.body.error.message).toEqual("Validation error");
            expect(dc.createDoctor).not.toHaveBeenCalled();
        });

        it("should return a 500 error when the controller throws an error", async () => {
            dc.createDoctor.mockImplementation((req, res, next) => {
                next(new Error("Internal Server Error"));
            });
    
            const response = await request(app)
                .post("/api/doctors")
                .send(validDoctor)
                .set("Content-Type", "application/json");
    
            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("error.message", "Internal Server Error");
            expect(dc.createDoctor).toHaveBeenCalledTimes(1);
        });
    });

    describe("PUT /api/doctors/:id", () => {
        it("should update a doctor and return success message", async () => {     
            const response = await request(app)
                .put(`/api/doctors/${doctorId}`)
                .send(updatedDoctor);
        
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                message: "Doctor updated successfully",
                doctor: { id: `${doctorId}`, ...updatedDoctor },
            });

            expect(dc.updateDoctor).toHaveBeenCalledTimes(1);
        });

        it("should return 404 when trying to update a non-existing doctor", async () => {
            dc.updateDoctor.mockImplementation((req, res) => {
                res.status(404).json({ error: "Doctor not found" });
            });
        
            const response = await request(app)
                .put(`/api/doctors/${invalidDoctorId}`)
                .send(updatedDoctor);
        
            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty("error", "Doctor not found");
            expect(dc.updateDoctor).toHaveBeenCalledTimes(1);
        });
        
        it("should return 400 when a required field is missing", async () => {
            const invalidDoctorData = { ...updatedDoctor };
            delete invalidDoctorData.first_name;
            
            const response = await request(app)
            .put(`/api/doctors/${doctorId}`)
            .send(invalidDoctorData);
            
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty("error");
            expect(response.body.error.message).toContain("Validation error");
            expect(dc.updateDoctor).not.toHaveBeenCalled();
        });
        
        it("should return 500 when an internal server error occurs", async () => {       
            dc.updateDoctor.mockImplementationOnce((req, res, next) => {
                next(new Error("Internal Server Error"));
            });
        
            const response = await request(app)
                .put(`/api/doctors/${doctorId}`)
                .send(updatedDoctor);
        
            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("error");
            expect(response.body.error).toHaveProperty("message", "Internal Server Error");
        });        
    });

    describe("DELETE /api/doctors/:id", () => {
        it("should return 200 when a doctor is successfully deleted", async () => {       
            const response = await request(app).delete(`/api/doctors/${doctorId}`);
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: "Doctor deleted successfully" });
            expect(dc.deleteDoctor).toHaveBeenCalledTimes(1);
        });
        
        it("should return 404 when the doctor does not exist", async () => {
            dc.deleteDoctor.mockImplementation((req, res) => res.status(404).json({ error: "Doctor not found" }));

            const response = await request(app).delete(`/api/doctors/${invalidDoctorId}`);
        
            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({ error: "Doctor not found" });
            expect(dc.deleteDoctor).toHaveBeenCalledTimes(1);
        });
        
        it("should return 404 when doctor ID is missing", async () => {
            const response = await request(app).delete(`/api/doctors/`);
        
            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({});
        });
        
        it("should return 500 when an internal server error occurs", async () => {
            dc.deleteDoctor.mockImplementationOnce((req, res, next) => {
                next(new Error("Internal Server Error"));
            });
        
            const response = await request(app).delete(`/api/doctors/${doctorId}`);
        
            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("error", {
                message: "Internal Server Error",
                status: 500,
            });
        });
    });

    describe("PATCH /api/doctors/:id/deactivate", () => {
        it("should deactivate a doctor successfully", async () => {   
            const response = await request(app).patch(`/api/doctors/${doctorId}/deactivate`);
        
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: "Doctor deactivated successfully" });
            expect(dc.deactivateDoctor).toHaveBeenCalledTimes(1);
        });
        
        it("should return 404 if doctor does not exist", async () => {
            dc.deactivateDoctor.mockImplementation((req, res) => res.status(404).json({ error: "Doctor not found" }));
            const response = await request(app).patch(`/api/doctors/${invalidDoctorId}/deactivate`);
        
            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({ error: "Doctor not found" });
            expect(dc.deactivateDoctor).toHaveBeenCalledTimes(1);
        });
        
        it("should return 500 if there is a server error", async () => {
            dc.deactivateDoctor.mockImplementationOnce((req, res, next) => {
                next(new Error("Internal Server Error"));
            })
            const response = await request(app).patch(`/api/doctors/${doctorId}/deactivate`);
        
            expect(response.statusCode).toBe(500);
            expect(dc.deactivateDoctor).toHaveBeenCalledTimes(1);
            expect(response.body).toHaveProperty("error", {
                message: "Internal Server Error",
                status: 500,
            });
        });
    });

    describe("PATCH /api/doctors/:id/activate", () => {
        it("should activate a doctor successfully", async () => {
            const response = await request(app).patch(`/api/doctors/${doctorId}/activate`);
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: "Doctor activated successfully" });
            expect(dc.activateDoctor).toHaveBeenCalledTimes(1);
        });
        
        it("should return 404 if doctor does not exist", async () => {
            dc.activateDoctor.mockImplementation((req, res) =>
                res.status(404).json({ error: "Doctor not found" })
            );
    
            const response = await request(app).patch(`/api/doctors/${invalidDoctorId}/activate`);
    
            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({ error: "Doctor not found" });
            expect(dc.activateDoctor).toHaveBeenCalledTimes(1);
        });

        it("should return 500 if there is a server error", async () => {
            dc.activateDoctor.mockImplementation((req, res, next) => {
                next(new Error("Internal Server Error"));
            });
    
            const response = await request(app).patch(`/api/doctors/${doctorId}/activate`);
    
            expect(response.statusCode).toBe(500);
            expect(dc.activateDoctor).toHaveBeenCalledTimes(1);
            expect(response.body).toHaveProperty("error", {
                message: "Internal Server Error",
                status: 500,
            });
        });
    });
});