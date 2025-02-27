import { createContext, useState, useEffect, useCallback } from "react";
import { getDoctorsRequest } from '../api/doctors.js';

export const DoctorsContext = createContext();

export const DoctorsProvider = ({ children }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDoctors = useCallback(async () => {
        setLoading(true);
        setError(null);
        let isMounted = true;

        try {
            const response = await getDoctorsRequest();
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

    return (
        <DoctorsContext.Provider value={{ doctors, loading, error, getDoctors }}>
            {children}
        </DoctorsContext.Provider>
    );
};