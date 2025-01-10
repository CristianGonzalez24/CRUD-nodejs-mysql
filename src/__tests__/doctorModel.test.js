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
    });
    
    describe('createDoctorInDB', () => {
        const mockDoctor = {
            first_name: "Test",
            last_name: "One",
            specialty: "Nothing",
            phone: "000000",
            email: "noexample@example.com",
            years_of_experience: 2,
            is_active: 0
        };
    
        it('should return the insertId when the doctor is successfully created', async () => {
            const mockInsertId = 10;
    
            mockDbQuery({ insertId: mockInsertId });
    
            const result = await createDoctorInDB(mockDoctor);
    
            expect(result).toEqual(mockInsertId);
        });
    
        it('should return undefined if the query result is malformed', async () => {
            mockDbQuery({});
    
            const result = await createDoctorInDB(mockDoctor);
    
            expect(result).toBeUndefined();
        });
    });
    
    describe('getDoctorById', () => {
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
    });

    describe('deactivateDoctorById', () => {
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
    
            const id = 999;
            const result = await deactivateDoctorById(id);
    
            expect(result).toEqual(mockResponse);
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
    
        it('should not activate a doctor if the ID does not exist or the doctor is already active', async () => {
            const mockResponse = {
                affectedRows: 0,
            };
    
            mockDbQuery(mockResponse);
    
            const id = 999;
            const result = await activateDoctorById(id);
    
            expect(result).toEqual(mockResponse);
        });
    });
    
    describe('checkDuplicateDoctor', () => {
        it('should return true if a duplicate doctor is found', async () => {
            const mockResponse = [
                { id: 2 },
            ];
    
            mockDbQuery(mockResponse);
    
            const email = 'johndoe@hotmail.com';
            const phone = '01153568451';
            const id = 1;
    
            const result = await checkDuplicateDoctor(email, phone, id);
    
            expect(result).toBe(true);
        });
    
        it('should return false if no duplicate doctor is found', async () => {
            const mockResponse = [];
    
            mockDbQuery(mockResponse);
    
            const email = 'newdoctor@example.com';
            const phone = '01165368451';
            const id = 1;
    
            const result = await checkDuplicateDoctor(email, phone, id);
    
            expect(result).toBe(false);
        });
    });

    describe('deleteDoctorById', () => {
        it('should return the result object when a doctor is successfully deleted', async () => {
            const mockResponse = {
                affectedRows: 1,
            };

            mockDbQuery(mockResponse);

            const id = 1;
            const result = await deleteDoctorById(id);

            expect(result).toEqual(mockResponse);
        });

        it('should return a result with affectedRows as 0 if no doctor is found with the given ID', async () => {
            const mockResponse = {
                affectedRows: 0,
            };

            mockDbQuery(mockResponse);

            const id = 999;
            const result = await deleteDoctorById(id);

            expect(result).toEqual(mockResponse);
        });
    });

    describe('updateDoctorById', () => {
        it('should return the result object when a doctor is successfully updated', async () => {
            const mockResponse = {
                affectedRows: 1,
                changedRows: 1, 
            };
    
            mockDbQuery(mockResponse);
    
            const id = 1;
            const updatedData = {
                first_name: 'UpdatedName',
                last_name: 'UpdatedLastName',
                specialty: 'UpdatedSpecialty',
                phone: '1234567890',
                email: 'updated.email@example.com',
                years_of_experience: 5,
                is_active: true,
            };
    
            const result = await updateDoctorById(id, updatedData);
    
            expect(result).toEqual(mockResponse);
        });
    
        it('should return a result with affectedRows as 0 if no doctor is found with the given ID', async () => {
            const mockResponse = {
                affectedRows: 0,
                changedRows: 0,
            };
    
            mockDbQuery(mockResponse);
    
            const id = 999; 
            const updatedData = {
                first_name: 'NonExistentName',
            };
    
            const result = await updateDoctorById(id, updatedData);
    
            expect(result).toEqual(mockResponse);
        });
    
        it('should allow partial updates by using NULL values for unchanged fields', async () => {
            const mockResponse = {
                affectedRows: 1,
                changedRows: 1,
            };
    
            mockDbQuery(mockResponse);
    
            const id = 1;
            const updatedData = {
                first_name: null, 
                last_name: 'NewLastName',
                specialty: null, 
                phone: null, 
                email: null, 
                years_of_experience: null, 
                is_active: null,
            };
    
            const result = await updateDoctorById(id, updatedData);
    
            expect(result).toEqual(mockResponse);
        });
    });    
});