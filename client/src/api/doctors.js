import axios from './axios';

export const getDoctorsRequest = () => axios.get('/doctors');
export const getAllDoctorsRequest = () => axios.get('/doctors/all');