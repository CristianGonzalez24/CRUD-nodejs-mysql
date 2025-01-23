import { jest } from '@jest/globals';
import { mockDbQueryError, mockDbQuery } from '../__mocks__/mockDb.js';
import { getDoctors, getAllDoctors, createDoctor, deactivateDoctor, activateDoctor } from '../controllers/doctors.controller.js';
import { pool } from '../config/db.js';

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
        req = { 
            query: { page: '1', limit: '10' }, 
            validData: {},
            params: {},
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
                .mockResolvedValueOnce([mockResponse]) 
                .mockResolvedValueOnce([[{ count: mockResponse.length }]]);

            await getDoctors(req, res, next); 
    
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
            const req = { query: { limit: '0', page: '1' } };
        
            await getDoctors(req, res, next);
        
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: "Both 'limit' and 'page' must be positive integers",
                status: 400,
            }));
            expect(res.json).not.toHaveBeenCalled();
        }); 
        
        it('should throw an error if page is not a positive integer', async () => {
            req.query = { page: '0', limit: '10' };
    
            await getDoctors(req, res, next);
    
            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: "Both 'limit' and 'page' must be positive integers",
                status: 400,
            }));
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should handle errors thrown during getActiveDoctors', async () => {
            const mockError = new Error(`Failed to retrieve active doctors. Limit: ${limit}, Offset: ${offset}`);
            mockDbQueryError(mockError);
    
            await getDoctors(req, res, next);
            
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should handle errors thrown during countActiveDoctors', async () => {
            const mockError = new Error('Failed to count active doctors');
            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([mockResponse])

            mockDbQueryError(mockError);
    
            await getDoctors(req, res, next);
            
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('getAllDoctors', () => {
        it('should return a list of all doctors and total count when successful', async () => {
            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([mockResponse]) 
                .mockResolvedValueOnce([[{ count: mockResponse.length }]]); 

            await getAllDoctors(req, res, next);

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
            const req = { query: { limit: '0', page: '1' } };

            await getAllDoctors(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: "Limit and page must be positive integers",
                status: 400,
            }));
            expect(res.json).not.toHaveBeenCalled();
        });
        
        it('should throw an error if page is not a positive integer', async () => {
            req.query = { page: '0', limit: '10' };

            await getAllDoctors(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: "Limit and page must be positive integers",
                status: 400,
            }));
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should handle errors thrown during getAllDoctorsFromDB', async () => {
            const mockError = new Error(`Failed to retrieve doctors. Limit: ${limit}, Offset: ${offset}`);
            mockDbQueryError(mockError);
    
            await getAllDoctors(req, res, next);
            
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should handle errors thrown during countAllDoctors', async () => {
            const mockError = new Error("Failed to count doctors in the database");  
            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([mockResponse])

            mockDbQueryError(mockError);
    
            await getAllDoctors(req, res, next);
            
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
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
        
            await createDoctor(req, res, next);
        
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Doctor created successfully",
                data: mockResponse[0],
            });
        
            expect(next).not.toHaveBeenCalled();
        });
        
        it('should throw an error if the doctor object is invalid or missing required fields', async () => {
            req.validData = null;

            await createDoctor(req, res, next);

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
            
            await createDoctor(req, res, next);
            
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
        
            await createDoctor(req, res, next);
        
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
        
            await createDoctor(req, res, next);
        
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
    
            await deactivateDoctor(req, res, next);
    
            expect(next).toHaveBeenCalledWith({
                message: "Doctor ID must be a positive integer",
                status: 400,
            });
        });

        it('should return 404 if the doctor does not exist', async () => {
            req.params.id = 1;
            mockDbQuery([null]);
    
            await deactivateDoctor(req, res, next);
    
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
        
            await deactivateDoctor(req, res, next);
        
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
        
            await deactivateDoctor(req, res, next);
        
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
        
            await deactivateDoctor(req, res, next);
        
            expect(next).toHaveBeenCalledWith(
                new Error(`Failed to update doctor status: ${mockError.message}`)
            );
        });       
    });

    describe('activateDoctor', () => {
        it('should return 400 if doctor ID is invalid', async () => {
            req.params.id = null;
    
            await activateDoctor(req, res, next);
    
            expect(next).toHaveBeenCalledWith({
                message: "Doctor ID must be a positive integer",
                status: 400,
            });
        });

        it('should return 404 if doctor does not exist', async () => {
            req.params.id = 999;
    
            mockDbQuery([]);
    
            await activateDoctor(req, res, next);
    
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
    
            await activateDoctor(req, res, next);
    
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
    
            await activateDoctor(req, res, next);
    
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
    
            await activateDoctor(req, res, next);
    
            expect(next).toHaveBeenCalledWith(
                new Error(`Failed to update doctor status: ${mockError.message}`));
        });     
    });
});