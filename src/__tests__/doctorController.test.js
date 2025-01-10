import { jest } from '@jest/globals';
import { getDoctors } from '../controllers/doctors.controller.js';
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
    
    let req, res, next;

    beforeEach(() => {
        req = { query: {} };
        res = { json: jest.fn() };
        next = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getDoctors', () => {      
        it('should return a list of active doctors and total count when successful', async () => {
            req.query = { page: '1', limit: '10' };
        
            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([mockResponse]) // getActiveDoctors
                .mockResolvedValueOnce([[{ count: mockResponse.length }]]); // countActiveDoctors
        
            await getDoctors(req, res, next);
        
            expect(res.json).toHaveBeenCalledWith({
                message: 'Active doctors retrieved successfully',
                total: mockResponse.length,
                data: mockResponse, 
                page: 1,
                limit: 10,
            });
        
            expect(next).not.toHaveBeenCalled(); // Sin errores
        });

        it('should call next with an error if getActiveDoctors throws an error', async () => {
            req = { query: { page: '1', limit: '10' } };
            const mockError = new Error('Database query failed');
        
            jest.spyOn(pool, 'query').mockRejectedValueOnce(mockError);
        
            await getDoctors(req, res, next);
        
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });

        it('should call next with an error if countActiveDoctors throws an error', async () => {
            req = { query: { page: '1', limit: '10' } };
            
            const mockError = new Error('Count query failed');
        
            jest.spyOn(pool, 'query')
                .mockResolvedValueOnce([mockResponse]) 
                .mockRejectedValueOnce(mockError);   
        
            await getDoctors(req, res, next);
        
            expect(next).toHaveBeenCalledWith(mockError);
            expect(res.json).not.toHaveBeenCalled();
        });
        
    });
});








