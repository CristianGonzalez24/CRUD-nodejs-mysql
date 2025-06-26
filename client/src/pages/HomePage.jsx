import { useEffect, useState } from 'react';
import { useLocation } from "react-router";
import { useDoctors } from '../hooks/useDoctors.js';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import HeroSection from '../components/HeroSection/HeroSection';
import ServicesSection from '../components/ServicesSection/ServicesSection';
import DoctorSection from '../components/DoctorSection/DoctorSection';
import ConfirmationModal from '../components/ConfirmationModal/ConfirmationModal';

const HomePage = () => {
    const { loading } = useDoctors();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState(null);

    if (loading) {
        return (
            <div className="loading-overlay" role="alert" aria-busy="true">
                <LoadingSpinner size={80} color="var(--primary-color)" />
            </div>
        );
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const error = params.get('error');
        if (error) {
            setErrorMessage(error);
    
            setTimeout(() => {
                const cleanUrl = window.location.origin + window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
            }, 5000);
        }
    }, [location]);

    return (
        <>
        <ConfirmationModal 
        isOpen={errorMessage !== null}
        onClose={() => setErrorMessage(null)}
        title="Error"
        message={errorMessage}
        type="danger"
        closing={false}
        cancelText="Close"
        />
        <HeroSection />
        <ServicesSection />
        <DoctorSection />
        </>
    )
}

export default HomePage