import { createContext, useState } from "react";
import { getDoctorsRequest } from '../api/doctors.js';

export const DoctorsContext = createContext();

export const DoctorsProvider = ({ children }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDoctors = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getDoctorsRequest();
            setDoctors(response.data.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            setError("Failed to fetch doctors. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DoctorsContext.Provider value={{ doctors, loading, error, getDoctors }}>
            {children}
        </DoctorsContext.Provider>
    );
};