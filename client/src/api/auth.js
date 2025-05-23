import axios from './axios';

export const loginRequest = (data) => axios.post('/auth/login', data);
export const registerRequest = (data) => axios.post('/auth/register', data);
export const logoutRequest = () => axios.post('/auth/logout');

export const getUserRequest = (token) => axios.get('/auth/me', {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
export const refreshTokenRequest = () => axios.post('/auth/refresh');
export const hasRefreshTokenRequest = () => axios.get('/auth/has-refresh-token');