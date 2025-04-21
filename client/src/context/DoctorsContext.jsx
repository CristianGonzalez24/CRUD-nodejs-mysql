import { createContext, useState, useCallback, useEffect } from "react";
import * as doctorsApi from '../api/doctors.js';
import { toast } from 'react-toastify';

export const DoctorsContext = createContext();

export const DoctorsProvider = ({ children }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [specializations, setSpecializations] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const getDoctors = useCallback(async () => {
        setLoading(true);
        setErrors(null);
        let isMounted = true;

        try {
            const response = isAdmin ? await doctorsApi.getAllDoctorsRequest() : await doctorsApi.getDoctorsRequest();
            if (isMounted) {
                setDoctors(response.data.data);
                const uniqueSpecializations = [...new Set(response.data.data.map(doctor => doctor.specialty))];
                setSpecializations(uniqueSpecializations);
            }
        } catch (error) {
            if(isMounted) {
                const errorMessage = error.response?.data?.error?.message || "Failed to fetch doctors. Please try again later";
                setErrors(errorMessage);
                toast.error(errorMessage);
            }
        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }

        return () => {
            isMounted = false;
        };
    }, []);

    const deactivateDoctor = async (doctorId) => {
        setLoading(true);
        setErrors(null);
        try {
            await doctorsApi.deactivateDoctorRequest(doctorId);
            toast.success("Doctor deactivated successfully!");
            getDoctors();
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message || "Failed to deactivate doctor. Please try again later";
            setErrors(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const activateDoctor = async (doctorId) => {
        setLoading(true);
        setErrors(null);
        try {
            await doctorsApi.activateDoctorRequest(doctorId);
            toast.success("Doctor activated successfully!");
            getDoctors();
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message || "Failed to activate doctor. Please try again later"; 
            setErrors(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const deleteDoctor = async (doctorId) => {
        setLoading(true);
        setErrors(null);
        try {
            await doctorsApi.deleteDoctorRequest(doctorId);
            toast.success("Doctor deleted successfully!");
            getDoctors();
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message || "Failed to delete doctor";
            setErrors(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const addDoctor = async (doctorData) => {    
        setLoading(true);
        setErrors(null);
        
        try {
            const formattedDoctorData = {
                first_name: doctorData.firstName,
                last_name: doctorData.lastName,
                specialty: doctorData.specialization,
                phone: doctorData.phone,
                email: doctorData.email,
                years_of_experience: Number(doctorData.experience)
            };

            const response = await doctorsApi.addDoctorRequest(formattedDoctorData);      
            getDoctors();    
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message || "Failed to add doctor. Please try again";
            setErrors(errorMessage);
            toast.error(errorMessage); 
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctorById = async (doctorId) => {
        setLoading(true);
        setErrors(null);
        try {
            const response = await doctorsApi.getDoctorByIdRequest(doctorId);
            return { success: true, doctor: response.data.data };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message || "Failed to fetch doctor. Please try again later";
            setErrors(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const updateDoctor = async (doctorId, doctorData) => {
        setLoading(true);
        setErrors(null);
        try {
            const formattedDoctorData = {
                first_name: doctorData.firstName,
                last_name: doctorData.lastName,
                specialty: doctorData.specialization,
                phone: doctorData.phone,
                email: doctorData.email,
                years_of_experience: Number(doctorData.experience)
            };

            const response = await doctorsApi.updateDoctorRequest(doctorId, formattedDoctorData);
            getDoctors();
            return { success: true, data: response.data.data };
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message || "Failed to update doctor. Please try again";
            setErrors(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (doctors.length === 0) {
            getDoctors();
        }
    }, [doctors.length, getDoctors]);

    return (
        <DoctorsContext.Provider value={{
            doctors,
            loading,
            errors,
            specializations,
            isAdmin,
            isLoggedIn,
            getDoctors,
            deactivateDoctor,
            activateDoctor,
            deleteDoctor,
            addDoctor,
            fetchDoctorById,
            updateDoctor
        }}>
            {children}
        </DoctorsContext.Provider>
    );
};