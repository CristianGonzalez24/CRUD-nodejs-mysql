import axios from './axios';

export const getDoctorsRequest = () => axios.get('/doctors');
export const getAllDoctorsRequest = () => axios.get('/doctors/all');

export const deactivateDoctorRequest = (id) => axios.patch(`/doctors/${id}/deactivate`);
export const activateDoctorRequest = (id) => axios.patch(`/doctors/${id}/activate`);
