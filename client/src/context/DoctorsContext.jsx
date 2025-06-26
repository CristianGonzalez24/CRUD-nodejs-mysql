import { createContext, useState, useCallback, useEffect } from "react";
import { useAuth } from '../hooks/useAuth.js';
import * as doctorsApi from '../api/doctors.js';
import { handleError } from '../utils/errorHandler.js';
import { toast } from 'react-toastify';

export const DoctorsContext = createContext();

export const DoctorsProvider = ({ children }) => {
    const { isAdmin } = useAuth();

    const [doctors, setDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    console.log(doctors);

    const getDoctors = useCallback(async () => {
        setLoading(true);
        setErrors(null);
        let isMounted = true;

        try {
            const response = isAdmin ? await doctorsApi.getAllDoctorsRequest() : await doctorsApi.getDoctorsRequest();
            const specialties = await doctorsApi.getSpecialtiesRequest();
            if (isMounted) {
                setDoctors(response.data.data);
                setSpecializations(specialties.data.data);
            }
        } catch (error) {
            if(isMounted) {
                const formattedError = handleError(error, { 
                    fallbackMessage: "Failed to fetch doctors. Please try again later",
                });
                setErrors(formattedError);
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
            const formattedError = handleError(error, {
                fallbackMessage: "Failed to deactivate doctor. Please try again later"
            })
            setErrors(formattedError);
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
            const formattedError = handleError(error, {
                fallbackMessage: "Failed to activate doctor. Please try again later"
            })
            setErrors(formattedError);
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
            const formattedError = handleError(error, {
                fallbackMessage: "Failed to delete doctor. Please try again later"
            })
            setErrors(formattedError);
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
            const errorMessage = error.response?.data?.error?.message;
            const formattedError = handleError(error, {
                fallbackMessage: "Failed to add doctor. Please try again"
            })
            setErrors(errorMessage);
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
            const errorMessage = error.response?.data?.error?.message;
            const formattedError = handleError(error, {
                fallbackMessage: "Failed to fetch doctor. Please try again later"
            })
            setErrors(formattedError);
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
            const errorMessage = error.response?.data?.error?.message;
            const formattedError = handleError(error, {
                fallbackMessage: "Failed to update doctor. Please try again"
            })
            setErrors(formattedError);
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

    useEffect(() => {
        if (errors) {
            const timer = setTimeout(() => {
                setErrors(null);
            }, 8000);
        
            return () => clearTimeout(timer);
        }
    }, [errors]);

    const value = {
        doctors,
        loading,
        errors,
        specializations,
        getDoctors,
        deactivateDoctor,
        activateDoctor,
        deleteDoctor,
        addDoctor,
        fetchDoctorById,
        updateDoctor
    };

    return (
        <DoctorsContext.Provider value={value}>
            {children}
        </DoctorsContext.Provider>
    );
};