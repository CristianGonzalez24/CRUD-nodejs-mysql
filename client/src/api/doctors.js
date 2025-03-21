import axios from './axios';

export const getDoctorsRequest = () => axios.get('/doctors?limit=0');
export const getAllDoctorsRequest = () => axios.get('/doctors/all?limit=0');

export const getDoctorByIdRequest = (id) => axios.get(`/doctors/${id}`);

export const deactivateDoctorRequest = (id) => axios.patch(`/doctors/${id}/deactivate`);
export const activateDoctorRequest = (id) => axios.patch(`/doctors/${id}/activate`);

export const deleteDoctorRequest = (id) => axios.delete(`/doctors/${id}`);

export const addDoctorRequest = (data) => axios.post('/doctors', data);

export const updateDoctorRequest = (id, data) => axios.put(`/doctors/${id}`, data);