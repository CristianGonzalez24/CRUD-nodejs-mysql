import { jest } from '@jest/globals';
import { pool } from '../config/db.js';

export const mockDbQuery = (mockResponse) => {
    const queryMock = jest.fn().mockResolvedValue([mockResponse]);
    jest.spyOn(pool, 'query').mockImplementation(queryMock);
};

export const mockDbQueryError = (mockError) => {
    const queryMock = jest.fn().mockRejectedValue(mockError);
    jest.spyOn(pool, 'query').mockImplementation(queryMock);
};

