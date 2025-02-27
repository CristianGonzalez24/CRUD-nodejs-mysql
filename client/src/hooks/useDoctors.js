import { useContext } from "react";
import { DoctorsContext } from '../context/DoctorsContext.jsx';

export const useDoctors = () => {
    const context = useContext(DoctorsContext);

    if (!context) {
        throw new Error("useDoctors must be used within a DoctorsProvider");
    }

    return context;
};