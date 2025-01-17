import {jest} from '@jest/globals';
import { mockDbQuery } from '../__mocks__/mockDb.js';
import { pool } from '../config/db.js';
import { 
    getDoctorById, 
    getActiveDoctors, 
    countActiveDoctors, 
    getAllDoctorsFromDB, 
    countAllDoctors,
    findDoctorByEmailOrPhone,
    createDoctorInDB,
    deactivateDoctorById,
    activateDoctorById,
    checkDuplicateDoctor,
    updateDoctorById,
    deleteDoctorById
} from './../models/doctor.model.js';

describe('doctorsModels', () => {

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    }); 

    afterAll(async () => {
        try {
            await pool.end();
        } catch (error) {
            console.error('Error closing the pool:', error);
        }
    });

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

    describe('getActiveDoctors', () => {
        it('should return a list of active doctors when the query is successful', async () => {
            mockDbQuery(mockResponse);

            const limit = 2;
            const offset = 0;
            const doctors = await getActiveDoctors(limit, offset);

            expect(doctors).toEqual(mockResponse);
        });

        it('should return an empty array when no active doctors are found', async () => {           
            mockDbQuery([]);
        
            const limit = 2;
            const offset = 0;       
            const doctors = await getActiveDoctors(limit, offset);
        
            expect(doctors).toEqual([]);  
        });

        it('should throw an error if limit is not a non-negative integer', async () => {
            await expect(getActiveDoctors(1.5, 0)).rejects.toThrow('Limit and offset must be non-negative integers');
        });

        it('should throw an error if offset is not a non-negative integer', async () => {
            await expect(getActiveDoctors(1, -1)).rejects.toThrow('Limit and offset must be non-negative integers');
        });
    });

    describe('countActiveDoctors', () => {
        it('should return the total count of active doctors when the query is successful', async () => {
            const mockResponse = [{ count: 5 }];
            mockDbQuery(mockResponse);
    
            const totalActiveDoctors = await countActiveDoctors();

            expect(totalActiveDoctors).toBe(5);
        });
    
        it('should return 0 when no active doctors are found', async () => {
            const mockResponse = [{ count: 0 }];
            mockDbQuery(mockResponse);
    
            const totalActiveDoctors = await countActiveDoctors();

            expect(totalActiveDoctors).toBe(0);
        });

        it('should throw an error if the query fails', async () => {
            const mockError = new Error("Failed to count active doctors");
            jest.spyOn(pool, 'query').mockRejectedValueOnce(mockError);

            await expect(countActiveDoctors()).rejects.toThrow(mockError);

            jest.spyOn(pool, 'query').mockRestore();
        });
    });    

    describe('getAllDoctorsFromDB', () => {      
        it('should return a list of doctors when the query is successful', async () => {
            mockDbQuery(mockResponse);
    
            const limit = 2;
            const offset = 0;
            const doctors = await getAllDoctorsFromDB(limit, offset);
    
            expect(doctors).toEqual(mockResponse);
        });
    
        it('should return an empty array when no doctors are found', async () => {
            mockDbQuery([]);
    
            const limit = 2;
            const offset = 0;
            const doctors = await getAllDoctorsFromDB(limit, offset);
    
            expect(doctors).toEqual([]);
        });

        it('should throw an error if limit is not a non-negative integer', async () => {
            await expect(getAllDoctorsFromDB(1.5, 0)).rejects.toThrow('Limit and offset must be non-negative integers');
        });
        
        it('should throw an error if offset is not a non-negative integer', async () => {
            await expect(getAllDoctorsFromDB(1, -1)).rejects.toThrow('Limit and offset must be non-negative integers');
        });
    });

    describe('countAllDoctors', () => {
        it('should return the total count of doctors in the database', async () => {
            mockDbQuery([{ count: 10 }]);
    
            const total = await countAllDoctors();

            expect(total).toBe(10);
        });
    
        it('should return 0 when there are no doctors in the database', async () => {
            mockDbQuery([{}]);
    
            const total = await countAllDoctors();

            expect(total).toBe(0);
        });

        it('should throw an error if the query fails', async () => {
            const mockError = new Error("Failed to count all doctors");
            jest.spyOn(pool, 'query').mockRejectedValueOnce(mockError);

            await expect(countAllDoctors()).rejects.toThrow(mockError);

            jest.spyOn(pool, 'query').mockRestore();
        });
    });

    describe('findDoctorByEmailOrPhone', () => {   
        it('should return a doctor if the email or phone matches', async () => {
            mockDbQuery([mockResponse[0]]);
    
            const email = 'johndoe@hotmail.com';
            const phone = '0000000000';  
            const result = await findDoctorByEmailOrPhone(email, phone);
    
            expect(result).toEqual([mockResponse[0]]);
        });
    
        it('should return an empty array if no matches are found', async () => {
            mockDbQuery([]);
    
            const email = 'nonexistent@example.com';
            const phone = '0000000000';
            const result = await findDoctorByEmailOrPhone(email, phone);
    
            expect(result).toEqual([]);
        });

        it('should throw an error if the query fails', async () => {
            const mockError = new Error("Failed to find doctor by email or phone");
            jest.spyOn(pool, 'query').mockRejectedValueOnce(mockError);

            await expect(findDoctorByEmailOrPhone('johndoe@hotmail.com', '0000000000')).rejects.toThrow(mockError);

            jest.spyOn(pool, 'query').mockRestore();
        });

        it('should throw an error if both email and phone are not provided', async () => {
            await expect(findDoctorByEmailOrPhone(null, null)).rejects.toThrow('Either email or phone must be provided');
        });
    });

    describe('createDoctorInDB', () => {
        const fakeDoctor = {
            phone: '123456',
            email: 'example@example.com',
            years_of_experience: 2,
        };
        
        it('should throw an error if the doctor object is null or undefined', async () => {
            await expect(createDoctorInDB(null)).rejects.toThrow("Cannot create doctor: doctor object is null or undefined");
        });

        it('should throw an error if the doctor object is missing required properties', async () => {

            await expect(createDoctorInDB(fakeDoctor)).rejects.toThrow('Cannot create doctor: first name, last name, and specialty are required');
        });

        it('should return the insertId when the doctor is successfully created', async () => {
            const mockInsertId = {
                insertId: 1,
            };

            mockDbQuery(mockInsertId);

            const result = await createDoctorInDB(mockResponse[0]);

            expect(result).toEqual(mockInsertId.insertId);
        });
    
        it('should throw an error if the query fails', async () => {
            const mockError = new Error("Failed to create doctor");
            jest.spyOn(pool, 'query').mockRejectedValueOnce(mockError);

            await expect(createDoctorInDB(mockResponse[0])).rejects.toThrow(mockError);

            jest.spyOn(pool, 'query').mockRestore();
        });
    });

    describe('getDoctorById', () => {
        it('should throw an error if the doctor ID is missing', async () => {
            await expect(getDoctorById(null)).rejects.toThrow('Doctor ID is required');
        });

        it('should return a doctor when a valid ID is provided', async () => {
            mockDbQuery([mockResponse[0]]);

            const doctor = await getDoctorById(1);

            expect(doctor).toEqual([mockResponse[0]]);
        });

        it('should return an empty array when no doctor is found', async () => {
            mockDbQuery([]);

            const doctor = await getDoctorById(2);

            expect(doctor).toEqual([]); 
        });

        it('should throw an error if the query fails', async () => {
            const mockError = new Error("Failed to find doctor by ID");
            jest.spyOn(pool, 'query').mockRejectedValueOnce(mockError);

            await expect(getDoctorById(1)).rejects.toThrow(mockError);

            jest.spyOn(pool, 'query').mockRestore();
        });
    });

    describe('deactivateDoctorById', () => {
        it('should throw an error if the doctor ID is missing', async () => {
            await expect(deactivateDoctorById(null)).rejects.toThrow('Doctor ID is required');
        });

        it('should deactivate a doctor when a valid ID is provided', async () => {
            const mockResponse = {
                affectedRows: 1,
            };
    
            mockDbQuery(mockResponse);
    
            const id = 1;
            const result = await deactivateDoctorById(id);
    
            expect(result).toEqual(mockResponse);
        });

        it('should not deactivate a doctor if the ID does not exist or the doctor is already inactive', async () => {
            const mockResponse = {
                affectedRows: 0,
            };

            mockDbQuery(mockResponse);

            await expect(deactivateDoctorById(999)).rejects.toThrow('Failed to deactivate doctor');
        });
    });

    describe('activateDoctorById', () => {
        it('should activate a doctor when a valid ID is provided', async () => {
            const mockResponse = {
                affectedRows: 1,
            };
    
            mockDbQuery(mockResponse);
    
            const id = 1;
            const result = await activateDoctorById(id);
    
            expect(result).toEqual(mockResponse);
        });

        it('should throw an error if no ID is provided', async () => {
            await expect(activateDoctorById(null)).rejects.toThrow("Doctor ID is required");
        });
    
        it('should throw an error if the doctor is not found or already active', async () => {
            const mockResponse = {
                affectedRows: 0,
            };
    
            mockDbQuery(mockResponse);
    
            await expect(activateDoctorById(999)).rejects.toThrow("Failed to activate doctor");
        });
    });

    describe('checkDuplicateDoctor', () => {
        it('should throw an error if the doctor ID is missing', async () => {
            await expect(checkDuplicateDoctor('example@example.com', '123456', null)).rejects.toThrow('Doctor ID is required');
        });

        it('should throw an error if both email and phone are missing', async () => {
            await expect(checkDuplicateDoctor(null, null, 1)).rejects.toThrow('Either email or phone must be provided');
        });

        it('should return true if a duplicate doctor is found', async () => {
            const mockInsertId = [
                { id: 2 },
            ];
    
            mockDbQuery(mockInsertId);
    
            const result = await checkDuplicateDoctor(mockResponse[0].email, mockResponse[0].phone, mockResponse[0].id);
    
            expect(result).toBe(true);
        });
    
        it('should return false if no duplicate doctor is found', async () => {
            const mockInsertId = [];
    
            mockDbQuery(mockInsertId);
    
            const email = 'newdoctor@example.com';
    
            const result = await checkDuplicateDoctor(email, mockResponse[0].phone, mockResponse[0].id);
    
            expect(result).toBe(false);
        });
    });

    describe('deleteDoctorById', () => {
        it('should throw an error if the doctor ID is missing', async () => {
            await expect(deleteDoctorById(null)).rejects.toThrow('Doctor ID is required');
        });

        it('should return the result object when a doctor is successfully deleted', async () => {
            const mockResponse = {
                affectedRows: 1,
            };

            mockDbQuery(mockResponse);

            const id = 1;
            const result = await deleteDoctorById(id);

            expect(result).toEqual(mockResponse);
        });

        it('should throw an error if no doctor is found', async () => {
            const mockResponse = {
                affectedRows: 0,
            };

            mockDbQuery(mockResponse);

            await expect(deleteDoctorById(999)).rejects.toThrow("Failed to delete doctor");
        });
    });

    describe('updateDoctorById', () => {
        const updatedData = {
            first_name: 'UpdatedName',
            last_name: 'UpdatedLastName',
            specialty: 'UpdatedSpecialty',
            phone: '1234567890',
            email: 'updated.email@example.com',
            years_of_experience: 5,
            is_active: true,
        };

        it('should throw an error if the doctor ID is missing', async () => {
            await expect(updateDoctorById(null, {})).rejects.toThrow('Doctor ID is required');
        });

        it('should return the result object when a doctor is successfully updated', async () => {
            const mockResponse = {
                affectedRows: 1,
            };
    
            mockDbQuery(mockResponse);
    
            const result = await updateDoctorById(1, updatedData);
    
            expect(result).toEqual(mockResponse);
        });
    
        it('should return a result with affectedRows as 0 if no doctor is found with the given ID', async () => {
            const mockResponse = {
                affectedRows: 0,
            };
    
            mockDbQuery(mockResponse);
    
            await expect(updateDoctorById(999, updatedData)).rejects.toThrow("Failed to update doctor");
        });
    
        it('should allow partial updates by using NULL values for unchanged fields', async () => {
            const mockResponse = {
                affectedRows: 1,
            };
    
            mockDbQuery(mockResponse);
    
            const updatedData = {
                first_name: null, 
                last_name: 'NewLastName',
                specialty: null, 
                phone: null, 
                email: null, 
                years_of_experience: null, 
                is_active: null,
            };
    
            const result = await updateDoctorById(1, updatedData);
    
            expect(result).toEqual(mockResponse);
        });
    });    
});