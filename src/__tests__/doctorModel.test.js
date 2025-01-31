import {jest} from '@jest/globals';
import { mockDbQuery, mockDbQueryError } from '../__mocks__/mockDb.js';
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
    const limit = 2;
    const offset = 0;

    describe('getActiveDoctors', () => {
        it('should return a list of active doctors when the query is successful', async () => {
            mockDbQuery(mockResponse);

            const doctors = await getActiveDoctors(limit, offset);

            expect(doctors).toEqual(mockResponse);
        });

        it('should return an empty array when no active doctors are found', async () => {           
            mockDbQuery([]);
        
            const doctors = await getActiveDoctors(limit, offset);
        
            expect(doctors).toEqual([]);  
        });

        it('should throw an error with the correct message when the query fails', async () => {
            const mockError = new Error('Database connection error');
            mockDbQueryError(mockError);
        
            await expect(getActiveDoctors(limit, offset)).rejects.toThrow(
                `Failed to retrieve active doctors. Limit: ${limit}, Offset: ${offset}`
            );
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
            mockDbQueryError(mockError);

            await expect(countActiveDoctors()).rejects.toThrow(mockError);

            jest.spyOn(pool, 'query').mockRestore();
        });
    });    

    describe('getAllDoctorsFromDB', () => {      
        it('should return a list of doctors when the query is successful', async () => {
            mockDbQuery(mockResponse);
    
            const doctors = await getAllDoctorsFromDB(limit, offset);
    
            expect(doctors).toEqual(mockResponse);
        });
    
        it('should return an empty array when no doctors are found', async () => {
            mockDbQuery([]);
    
            const doctors = await getAllDoctorsFromDB(limit, offset);
    
            expect(doctors).toEqual([]);
        });

        it('should throw an error with the correct message when the query fails', async () => {
            const mockError = new Error('Database connection error');
            mockDbQueryError(mockError);
        
            await expect(getAllDoctorsFromDB(limit, offset)).rejects.toThrow(
                `Failed to retrieve doctors. Limit: ${limit}, Offset: ${offset}`
            );
        });
    });

    describe('countAllDoctors', () => {
        it('should return the total count of doctors in the database', async () => {
            mockDbQuery([{ count: 10 }]);
            
            const total = await countAllDoctors();

            expect(total).toBe(10);
        });
        
        it('should return 0 when there are no doctors in the database', async () => {
            mockDbQuery([{ count: 0 }]);
    
            const total = await countAllDoctors();

            expect(total).toBe(0);
        });

        it('should throw an error if the query fails', async () => {
            const mockError = new Error("Failed to count doctors in the database");
            mockDbQueryError(mockError);

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
            const mockError = new Error("Database query failed in findDoctorByEmailOrPhone");
            mockDbQueryError(mockError);

            await expect(findDoctorByEmailOrPhone('johndoe@hotmail.com', '0000000000')).rejects.toThrow(mockError);

            jest.spyOn(pool, 'query').mockRestore();
        });

        it('should throw an error if both email and phone are not provided', async () => {
            await expect(findDoctorByEmailOrPhone(null, null)).rejects.toThrow('Both email and phone are missing in findDoctorByEmailOrPhone');
        });
    });

    describe('createDoctorInDB', () => {

        it('should return the insertId when the doctor is successfully created', async () => {
            mockDbQuery({insertId: 1});
            
            const result = await createDoctorInDB(mockResponse[0]);
            
            expect(result).toEqual(1);
            expect(pool.query).toHaveBeenCalledTimes(1);
        });
        
        it('should return null if insertId is null or undefined', async () => {
            mockDbQuery({ insertId: null });
        
            const result = await createDoctorInDB(mockResponse[0]);
            expect(result).toBeNull();
            expect(pool.query).toHaveBeenCalledTimes(1);
        });               
    
        it('should throw an error if the query fails', async () => {
            const mockError = new Error("Database query failed in createDoctorInDB");
            mockDbQueryError(mockError);
            
            await expect(createDoctorInDB(mockResponse[0])).rejects.toThrow(mockError);
            
            jest.spyOn(pool, 'query').mockRestore();
        });        
    });

    describe('getDoctorById', () => {
        it('should throw an error if the doctor ID is missing', async () => {
            await expect(getDoctorById(null)).rejects.toThrow('Doctor ID is required');
        });
    
        it('should return null if the doctor does not exist in the database', async () => {
            mockDbQuery([]);
            const result = await getDoctorById(999);
            expect(result).toBeNull();
            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM doctors WHERE id = ?',
                [999]
            );
        });

        it('should return the doctor if the ID exists in the database', async () => {   
            mockDbQuery([mockResponse[0]]);
            const result = await getDoctorById(1);
            expect(result).toEqual(mockResponse[0]);
            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM doctors WHERE id = ?',
                [1]
            );
        });

        it('should throw an error if the database response format is invalid', async () => {
            mockDbQuery(undefined);
            await expect(getDoctorById(1)).rejects.toThrow(
                'Failed to retrieve doctor by ID: Unexpected database response format'
            );
            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM doctors WHERE id = ?',
                [1]
            );
        });
        
        it('should throw an error if the database query fails', async () => {
            const mockError = new Error('Database connection failed');
            mockDbQueryError(mockError);
    
            await expect(getDoctorById(1)).rejects.toThrow(
                'Failed to retrieve doctor by ID: Database connection failed'
            );
            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM doctors WHERE id = ?',
                [1]
            );
        });
    });

    describe('deactivateDoctorById', () => {
        it('should deactivate a doctor and return true for a valid ID', async () => {
            const mockResponse = {
                affectedRows: 1,
            };
    
            mockDbQuery(mockResponse);
    
            const id = 1;
            const result = await deactivateDoctorById(id);
    
            expect(result).toBe(true); 
            expect(pool.query).toHaveBeenCalledWith(
                `UPDATE doctors SET is_active = FALSE WHERE id = ? AND is_active = TRUE`,
                [id]
            );
        });

        it('should return false if the doctor ID does not exist or is already inactive', async () => {
            const mockResponse = {
                affectedRows: 0,
            };
    
            mockDbQuery(mockResponse);
    
            const id = 999;
            const result = await deactivateDoctorById(id);
    
            expect(result).toBe(false);
            expect(pool.query).toHaveBeenCalledWith(
                `UPDATE doctors SET is_active = FALSE WHERE id = ? AND is_active = TRUE`,
                [id]
            );
        });

        it('should throw an error if the database query fails', async () => {
            const mockError = new Error('Database query failed');
    
            mockDbQueryError(mockError);
    
            const id = 1;
            await expect(deactivateDoctorById(id)).rejects.toThrow(
                `Failed to update doctor status: ${mockError.message}`
            );
            expect(pool.query).toHaveBeenCalledWith(
                `UPDATE doctors SET is_active = FALSE WHERE id = ? AND is_active = TRUE`,
                [id]
            );
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
    
            expect(result).toBe(true);
            expect(pool.query).toHaveBeenCalledWith(
                `UPDATE doctors SET is_active = TRUE WHERE id = ? AND is_active = FALSE`,
                [id]
            );
        });
    
        it('should throw an error if the doctor is not found or already active', async () => {
            const mockResponse = {
                affectedRows: 0,
            };
    
            mockDbQuery(mockResponse);
    
            const id = 999;
            const result = await activateDoctorById(id);

            expect(result).toBe(false);
            expect(pool.query).toHaveBeenCalledWith(
                `UPDATE doctors SET is_active = TRUE WHERE id = ? AND is_active = FALSE`,
                [id]
            );
        });

        it('should throw an error if the database query fails', async () => {
            const mockError = new Error('Database query failed');
    
            mockDbQueryError(mockError);
    
            const id = 1;
            await expect(activateDoctorById(id)).rejects.toThrow(
                `Failed to update doctor status: ${mockError.message}`
            );
            expect(pool.query).toHaveBeenCalledWith(
                `UPDATE doctors SET is_active = TRUE WHERE id = ? AND is_active = FALSE`,
                [id]
            );
        });
    });

    describe('checkDuplicateDoctor', () => {
        it("should throw an error if both email and phone are null", async () => {
            await expect(checkDuplicateDoctor(null, null, mockResponse[0].id)).rejects.toThrow(
                "Both email and phone are missing in checkDuplicateDoctor"
            );
        
            expect(pool.query).not.toHaveBeenCalled();
        });

        it("should return true if duplicates are found", async () => {       
            mockDbQuery([[{ id: 2 }]]); // Mock a duplicate result
        
            const result = await checkDuplicateDoctor(mockResponse[0].email, mockResponse[0].phone, mockResponse[0].id);
        
            expect(pool.query).toHaveBeenCalledWith(
                "SELECT id FROM doctors WHERE (email = ? OR phone = ?) AND id != ?",
                [mockResponse[0].email, mockResponse[0].phone, mockResponse[0].id]
            );
            expect(result).toBe(true);
        });

        it("should return false if no duplicates are found", async () => {
            mockDbQuery([]); // Mock an empty result

            const result = await checkDuplicateDoctor(mockResponse[0].email, mockResponse[0].phone, mockResponse[0].id);

            expect(pool.query).toHaveBeenCalledWith(
                "SELECT id FROM doctors WHERE (email = ? OR phone = ?) AND id != ?",
                [mockResponse[0].email, mockResponse[0].phone, mockResponse[0].id]
            );
            expect(result).toBe(false);
        });

        it("should throw an error if the database query fails", async () => {
            const email = "error@example.com";
            const phone = "1112223333";
            const id = 1;
        
            const mockError = new Error("Database query failed");
            mockDbQueryError(mockError);
        
            await expect(checkDuplicateDoctor(mockResponse[0].email, mockResponse[0].phone, mockResponse[0].id)).rejects.toThrow(
                "Database query failed in checkDuplicateDoctor"
            );
        
            expect(pool.query).toHaveBeenCalledWith(
                "SELECT id FROM doctors WHERE (email = ? OR phone = ?) AND id != ?",
                [mockResponse[0].email, mockResponse[0].phone, mockResponse[0].id]
            );
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

        it("should return true when a doctor is successfully updated", async () => {        
            const mockResponse = { affectedRows: 1 };

            mockDbQuery(mockResponse); 

            const result = await updateDoctorById(1, updatedData);

            expect(result).toBe(true);

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining("UPDATE doctors SET"),
                expect.arrayContaining([
                updatedData.first_name,
                updatedData.last_name,
                updatedData.specialty,
                updatedData.phone,
                updatedData.email,
                updatedData.years_of_experience,
                updatedData.is_active,
                1,
            ]));
        });
    
        it("should return false if no rows are affected (ID does not exist)", async () => {
            const mockResponse = { affectedRows: 0 };
            mockDbQuery(mockResponse);

            const result = await updateDoctorById(999, updatedData);

            expect(result).toBe(false);

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining("UPDATE doctors SET"),
                expect.any(Array)
            );
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
    
            expect(result).toBe(true);
        });

        it("should throw an error if the database query fails", async () => {
            mockDbQueryError(new Error("Database error"));
        
            await expect(updateDoctorById(1, mockResponse[0])).rejects.toThrow(
                "Failed to update doctor: Database error"
            );
        });
    });    

    describe('deleteDoctorById', () => {
        it("should delete a doctor successfully and return the result", async () => {
            const mockResponse = { affectedRows: 1 };
            mockDbQuery(mockResponse);
        
            const result = await deleteDoctorById(1);
        
            expect(result).toEqual(mockResponse);
            expect(pool.query).toHaveBeenCalledWith("DELETE FROM doctors WHERE id = ?", [1]);
        });

        it("should return null if no doctor is deleted (ID does not exist)", async () => {
            const mockResponse = { affectedRows: 0 };
            mockDbQuery(mockResponse);
        
            const result = await deleteDoctorById(999); // ID inexistente
        
            expect(result).toBeNull();
            expect(pool.query).toHaveBeenCalledWith("DELETE FROM doctors WHERE id = ?", [999]);
        });

        it("should throw an error if the database query fails", async () => {
            mockDbQueryError(new Error("Database connection failed"));
        
            await expect(deleteDoctorById(1)).rejects.toThrow("Failed to delete doctor: Database connection failed");
        
            expect(pool.query).toHaveBeenCalledWith("DELETE FROM doctors WHERE id = ?", [1]);
        });
    });
});