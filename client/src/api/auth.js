import axios from './axios';

export const loginRequest = (data) => axios.post('/auth/login', data);
export const registerRequest = (data) => axios.post('/auth/register', data);
export const logoutRequest = () => axios.post('/auth/logout');

export const getUserRequest = () => axios.get('/auth/me');
export const checkAuthRequest = () => axios.get('/auth/check-auth');