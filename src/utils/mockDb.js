import {jest} from '@jest/globals';
import { pool } from '../config/db.js';

export const mockDbQuery = (mockResponse) => {
    jest.spyOn(pool, 'query').mockResolvedValue([mockResponse]);
};

// export const mockDbQuery = (mockResponse) => {
//     jest.mock('../config/db.js', () => ({
//         pool: {
//             query: jest.fn().mockResolvedValueOnce([mockResponse]),
//         },
//     }));
// };