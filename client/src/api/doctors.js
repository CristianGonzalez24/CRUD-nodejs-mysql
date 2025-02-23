import axios from './axios';

export const getDoctorsRequest = () => axios.get('/doctors');