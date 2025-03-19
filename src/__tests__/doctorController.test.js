import { jest } from '@jest/globals';
import { mockDbQueryError, mockDbQuery } from '../__mocks__/mockDb.js';
import { pool } from '../config/db.js';
import * as dc from '../controllers/doctors.controller.js';

describe('doctorsControllers', () => {
    const mockResponse = [
        {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "specialty": "Cardiology",
            "phone": "01153568451",
            "email": "johndoe@hotmail.com",
            "years_of_experience": 2,
            "is_active": 1
        },
        {
            "id": 2,
            "first_name": "Jane",
            "last_name": "Smith",
            "specialty": "Neurology",
            "phone": "9876543210",
            "email": "jane.smith@gmail.com",
            "years_of_experience": 8,
            "is_active": 1
        },
    ];
    const limit = 10;
    const offset = 0;
    
    let req, res, next;

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();

        req = { 
            query: { page: '1', limit: '10' }, 
            validData: {},
            params: {},
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(), // Permite el encadenamiento
            json: jest.fn(),
        }; 
        next = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    afterAll(async () => {
        try {
            await pool.end();
        } catch (error) {
            console.error('Error closing the pool:', error);
        }
    });

    describe('getDoctors', () => {
        it('should return a list of active doctors and the total count when successful', async () => {
            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([[{ count: mockResponse.length }]])
                .mockResolvedValueOnce([mockResponse]);

            await dc.getDoctors(req, res, next); 
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Active doctors retrieved successfully',
                total: mockResponse.length,
                totalPages: 1,
                data: mockResponse,
                page: 1,
                limit: 10,
            });
        
            expect(next).not.toHaveBeenCalled();
        });

        it('should throw an error if limit is not a positive integer', async () => {
            const req = { query: { limit: '-1', page: '1' } };
        
            await dc.getDoctors(req, res, next);
        
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: "Limit and page must be positive integers (limit can be 0 for all active doctors)",
                status: 400,
            }));
            expect(res.json).not.toHaveBeenCalled();
        }); 
        
        it('should throw an error if page is not a positive integer', async () => {
            req.query = { page: '0', limit: '10' };
    
            await dc.getDoctors(req, res, next);
    
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: "Limit and page must be positive integers (limit can be 0 for all active doctors)",
                status: 400,
            }));
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should handle errors thrown during getActiveDoctors', async () => {
            const mockError = new Error('Database query failed while counting active doctors');
            mockDbQueryError(mockError);
    
            await dc.getDoctors(req, res, next);
            
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should handle errors thrown during countActiveDoctors', async () => {
            const mockError = new Error('Database query failed while counting active doctors');
            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([mockResponse])

            mockDbQueryError(mockError);
    
            await dc.getDoctors(req, res, next);
            
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('getAllDoctors', () => {
        it('should return a list of all doctors and total count when successful', async () => {
            jest.spyOn(pool, 'query')
            .mockResolvedValueOnce([[{ count: mockResponse.length }]])
            .mockResolvedValueOnce([mockResponse]) ;

            await dc.getAllDoctors(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'All doctors retrieved successfully',
                total: mockResponse.length,
                totalPages: 1,
                data: mockResponse,
                page: 1,
                limit: 10,
            });

            expect(next).not.toHaveBeenCalled();
        });

        it('should throw an error if limit is not a positive integer', async () => {
            const req = { query: { limit: '-1', page: '1' } };

            await dc.getAllDoctors(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: "Limit and page must be positive integers (limit can be 0 for all doctors)",
                status: 400,
            }));
            expect(res.json).not.toHaveBeenCalled();
        });
        
        it('should throw an error if page is not a positive integer', async () => {
            req.query = { page: '0', limit: '10' };

            await dc.getAllDoctors(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: "Limit and page must be positive integers (limit can be 0 for all doctors)",
                status: 400,
            }));
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should handle errors thrown during getAllDoctorsFromDB', async () => {
            const mockError = new Error('Database query failed while fetching doctors');

            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([[{ count: mockResponse.length }]])
            mockDbQueryError(mockError);
    
            await dc.getAllDoctors(req, res, next);
            
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should handle errors thrown during countAllDoctors', async () => {
            const mockError = new Error("Failed to count doctors in the database");  

            mockDbQueryError(mockError);
    
            await dc.getAllDoctors(req, res, next);
            
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('getDoctorById', () => {
        it('should throw an error if ID is not a positive integer', async () => {
            req.params.id = '-1';    

            await dc.getDoctorById(req, res, next);            

            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: "Invalid doctor ID",  
                status: 400,
            }))
        });
        it('should throw an error if the doctor is not found (ID does not exist)', async () => {
            req.params.id = 999;
        
            mockDbQuery([null]);
        
            await dc.getDoctorById(req, res, next);
        
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: `Doctor with ID ${req.params.id} not found`,
                status: 404,
            }));
        
            expect(res.json).not.toHaveBeenCalled();
        });
        it('should return a doctor by ID when successful', async () => {
            req.params.id = mockResponse[0].id;
        
            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([[mockResponse[0]]]);
        
            await dc.getDoctorById(req, res, next);
        
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Doctor retrieved successfully',
                data: mockResponse[0],
            });
        
            expect(next).not.toHaveBeenCalled();
        }); 

        it('should pass unexpected errors to next', async () => {
            req.params.id = mockResponse[1].id;

            mockDbQueryError(new Error("Database error"));

            await dc.getDoctorById(req, res, next);            

            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('createDoctor', () => {
        it('should create a doctor and return a success message', async () => {
            req.validData = mockResponse[0];
        
            jest.spyOn(pool, 'query')
                // Primer mock: buscar doctor existente (devolver vacío)
                .mockResolvedValueOnce([[]]) // Siempre debe ser un arreglo anidado
                // Segundo mock: insertar doctor (retorna el ID insertado)
                .mockResolvedValueOnce([{ insertId: mockResponse[0].id }])
                // Tercer mock: recuperar doctor recién creado (retorna el doctor creado)
                .mockResolvedValueOnce([[mockResponse[0]]]); // También debe ser un arreglo anidado
        
            await dc.createDoctor(req, res, next);
        
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Doctor created successfully",
                data: mockResponse[0],
            });
        
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should throw an error if the doctor object is invalid or missing required fields', async () => {
            req.validData = null;

            await dc.createDoctor(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: "Doctor object is invalid or missing required fields",
                status: 400,
            }));
            expect(res.json).not.toHaveBeenCalled();
        });
        
        it('should throw an error if the doctor with the email or phone already exists', async () => { 
            req.validData = mockResponse[0];

            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([[mockResponse[0]]]);
            
            await dc.createDoctor(req, res, next);
            
            expect(next).toHaveBeenCalledWith({
                message: "Doctor with this email or phone already exists",
                status: 400,
            });
            expect(res.json).not.toHaveBeenCalled();
        });
        
        it('should call next with an error if doctorId is null or undefined after creating doctor', async () => {
            req.validData = mockResponse[0];
        
            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([{ insertId: null }]); 
        
            await dc.createDoctor(req, res, next);
        
            expect(next).toHaveBeenCalledWith({
                message: "Failed to create doctor: Unable to generate ID",
                status: 500,
            });
            
            expect(res.json).not.toHaveBeenCalled();
        });   
        
        it('should return an error if the newly created doctor cannot be retrieved', async () => {
            req.validData = mockResponse[0];
        
            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([{ insertId: mockResponse[0].id }])
                .mockResolvedValueOnce([[]]); 
        
            await dc.createDoctor(req, res, next);
        
            expect(next).toHaveBeenCalledWith({
                message: "Failed to retrieve the newly created doctor from the database",
                status: 500,
            });
            
            expect(res.json).not.toHaveBeenCalled();
        });      
    });

    describe('deactivateDoctor', () => {
        it('should return 400 if the doctor ID is missing', async () => {
            req.params.id = null;
    
            await dc.deactivateDoctor(req, res, next);
    
            expect(next).toHaveBeenCalledWith({
                message: "Invalid doctor ID",
                status: 400,
            });
        });

        it('should return 404 if the doctor does not exist', async () => {
            req.params.id = 1;
            mockDbQuery([null]);
    
            await dc.deactivateDoctor(req, res, next);
    
            expect(next).toHaveBeenCalledWith({
                message: "Doctor not found",
                status: 404,
            });
        });

        it('should return 500 if deactivation fails', async () => {
            req.params.id = 1;
        
            jest.spyOn(pool, 'query')
                // getDoctorById
                .mockResolvedValueOnce([[{ id: 1, is_active: true }]]) 
                // deactivateDoctorById
                .mockResolvedValueOnce([{ affectedRows: 0 }]);
        
            await dc.deactivateDoctor(req, res, next);
        
            expect(next).toHaveBeenCalledWith({
                message: "Failed to deactivate doctor",
                status: 500,
            });
        });

        it('should deactivate a doctor successfully', async () => {
            req.params.id = 1;
        
            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([[{ id: 1, is_active: true }]])
                .mockResolvedValueOnce([{ affectedRows: 1 }]);
        
            await dc.deactivateDoctor(req, res, next);
        
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Doctor marked as inactive successfully",
                doctorId: req.params.id,
            });
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should handle unexpected errors', async () => {
            req.params.id = 1;
        
            const mockError = new Error('Unexpected error');
        
            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([[{ id: 1, is_active: true }]])
                .mockRejectedValueOnce(mockError);
        
            await dc.deactivateDoctor(req, res, next);
        
            expect(next).toHaveBeenCalledWith(
                new Error(`Failed to update doctor status: ${mockError.message}`)
            );
        });       
    });

    describe('activateDoctor', () => {
        it('should return 400 if doctor ID is invalid', async () => {
            req.params.id = null;
    
            await dc.activateDoctor(req, res, next);
    
            expect(next).toHaveBeenCalledWith({
                message: "Invalid doctor ID",
                status: 400,
            });
        });

        it('should return 404 if doctor does not exist', async () => {
            req.params.id = 999;
    
            mockDbQuery([]);
    
            await dc.activateDoctor(req, res, next);
    
            expect(next).toHaveBeenCalledWith({
                message: "Doctor not found",
                status: 404,
            });
        });

        it('should return 404 if doctor is already active', async () => {
            req.params.id = 1;
    
            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([[{ id: 1, is_active: true }]]) 
                .mockResolvedValueOnce([{ affectedRows: 0 }]);
    
            await dc.activateDoctor(req, res, next);
    
            expect(next).toHaveBeenCalledWith({
                message: "Doctor not found or already active",
                status: 404,
            });
        });

        it('should activate the doctor successfully', async () => {
            req.params.id = 1;
    
            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([[{ id: 1, is_active: false }]]) 
                .mockResolvedValueOnce([{ affectedRows: 1 }]); 
    
            await dc.activateDoctor(req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Doctor reactivated successfully",
                doctorId: req.params.id,
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle unexpected errors', async () => {
            req.params.id = 1;
    
            const mockError = new Error("Unexpected error");
    
            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([[{ id: 1, is_active: false }]]) 
                .mockRejectedValueOnce(mockError);
    
            await dc.activateDoctor(req, res, next);
    
            expect(next).toHaveBeenCalledWith(
                new Error(`Failed to update doctor status: ${mockError.message}`));
        });     
    });

    describe("updateDoctor", () => {
        it("should return 400 if doctor ID is invalid", async () => {
            req.params.id = null;
        
            await dc.updateDoctor(req, res, next);
        
            expect(next).toHaveBeenCalledWith({
                message: "Invalid doctor ID",
                status: 400,
            });
        });

        it("should return 404 if doctor is not found", async () => {
            req.params.id = 1;

            mockDbQuery([]);

            await dc.updateDoctor(req, res, next);

            expect(pool.query).toHaveBeenCalledWith(
                "SELECT * FROM doctors WHERE id = ?",
                [1]
            );

            expect(next).toHaveBeenCalledWith({
                message: "Doctor not found",
                status: 404,
            });
        });

        it("should return 400 if email or phone is already in use by another doctor", async () => {
            req.params.id = 1;
            req.body = {
                email: "duplicate@example.com",
                phone: "1234567890",
            };

            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([[{ id: 1 }]])
                .mockResolvedValueOnce([[{ id: 2 }]]);

            await dc.updateDoctor(req, res, next);

            expect(pool.query).toHaveBeenCalledWith(
                "SELECT id FROM doctors WHERE (email = ? OR phone = ?) AND id != ?",
                ["duplicate@example.com", "1234567890", 1]
            );

            expect(next).toHaveBeenCalledWith({
                message: "Email or phone number already in use by another doctor",
                status: 400,
            });
        });

        it("should return 500 if no rows are affected (failed update)", async () => {
            req.params.id = 999;
            req.body = {
                first_name: "UpdatedName",
                last_name: "UpdatedLastName",
            };
            
            jest.spyOn(pool, "query")
                .mockResolvedValueOnce([[{ id: 999 }]])
                .mockResolvedValueOnce([[]])
                .mockResolvedValueOnce([{ affectedRows: 0 }]);
        
            await dc.updateDoctor(req, res, next);
        
            expect(next).toHaveBeenCalledWith({
                message: "Failed to update the doctor",
                status: 500,
            });
        });
        
        it("should return 200 and updated doctor data when update is successful", async () => {
            req.params.id = 1;
            req.body = {
                first_name: "UpdatedName",
                last_name: "UpdatedLastName",
                specialty: "UpdatedSpecialty",
                phone: "1234567890",
                email: "updated.email@example.com",
                years_of_experience: 10,
                is_active: true,
            };
        
            jest.spyOn(pool, "query")
                .mockResolvedValueOnce([[{ id: 1 }]])
                .mockResolvedValueOnce([[]]) 
                .mockResolvedValueOnce([{ affectedRows: 1 }]); 

            await dc.updateDoctor(req, res, next);
        
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Doctor updated successfully",
                updatedDoctor: {
                    id: 1,
                    first_name: "UpdatedName",
                    last_name: "UpdatedLastName",
                    specialty: "UpdatedSpecialty",
                    phone: "1234567890",
                    email: "updated.email@example.com",
                    years_of_experience: 10,
                    is_active: true,
                },
            });
        });
        
        it("should call next with an error if an unexpected error occurs", async () => {
            req.params.id = 1;
            req.body = {
                first_name: "UpdatedName",
                last_name: "UpdatedLastName",
            };
        
            mockDbQueryError(new Error("Database connection failed"));
        
            await dc.updateDoctor(req, res, next);
        
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });        
    });

    describe("deleteDoctor", () => {
        it("should return 400 if ID is invalid", async () => {
            req.params.id = "abc";
    
            await dc.deleteDoctor(req, res, next);
    
            expect(next).toHaveBeenCalledWith({
                message: "Invalid doctor ID",
                status: 400,
            });
        });

        it("should return 404 if the doctor does not exist", async () => {
            req.params.id = 999;
        
            mockDbQuery([null]);
        
            await dc.deleteDoctor(req, res, next);
        
            expect(next).toHaveBeenCalledWith({
                message: "Doctor not found",
                status: 404,
            });
        });
        
        it("should return 500 if deleting the doctor fails", async () => {
            req.params.id = 3;
            
            jest.spyOn(pool, "query")
                .mockResolvedValueOnce([[{ id: 3 }]])
                .mockResolvedValueOnce([{ affectedRows: 0 }]);

            await dc.deleteDoctor(req, res, next);
        
            expect(next).toHaveBeenCalledWith({
                message: "Failed to delete the doctor",
                status: 500,
            });
        });
        
        it("should return 200 and success message when deletion is successful", async () => {
            req.params.id = mockResponse[0].id;
            
            jest.spyOn(pool, "query")
                .mockResolvedValueOnce([[{ id: mockResponse[0].id }]])
                .mockResolvedValueOnce([{ affectedRows: 1 }]);

            await dc.deleteDoctor(req, res, next);
        
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Doctor deleted successfully" });
        });        

        it("should pass unexpected errors to next", async () => {
            req.params.id = 4;
        
            mockDbQueryError(new Error("Database error"));
        
            await dc.deleteDoctor(req, res, next);
        
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});