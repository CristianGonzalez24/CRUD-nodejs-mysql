import { createContext, useState, useCallback } from "react";
import * as doctorsApi from '../api/doctors.js';
import { toast } from 'react-toastify';

export const DoctorsContext = createContext();

export const DoctorsProvider = ({ children }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(true);

    const getDoctors = useCallback(async () => {
        setLoading(true);
        setError(null);
        let isMounted = true;

        try {
            const response = isAdmin ? await doctorsApi.getAllDoctorsRequest() : await doctorsApi.getDoctorsRequest();
            if (isMounted) {
                setDoctors(response.data.data);
            }
        } catch (error) {
            if(isMounted) {
                toast.error("Failed to fetch doctors. Please try again later.");
                setError("Failed to fetch doctors. Please try again later.");
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
        setError(null);
        try {
            await doctorsApi.deactivateDoctorRequest(doctorId);
            toast.success("Doctor deactivated successfully!");
            getDoctors();
        } catch (error) {
            toast.error("Failed to deactivate doctor. Please try again later.");
            console.error("Failed to deactivate doctor:", error);
        } finally {
            setLoading(false);
        }
    };

    const activateDoctor = async (doctorId) => {
        setLoading(true);
        setError(null);
        try {
            await doctorsApi.activateDoctorRequest(doctorId);
            toast.success("Doctor activated successfully!");
            getDoctors();
        } catch (error) {
            toast.error("Failed to activate doctor. Please try again later.");
            console.error("Failed to activate doctor:", error); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <DoctorsContext.Provider value={{ doctors, loading, error, isAdmin, getDoctors, deactivateDoctor, activateDoctor }}>
            {children}
        </DoctorsContext.Provider>
    );
};