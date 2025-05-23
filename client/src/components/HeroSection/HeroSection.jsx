import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.js';
import { useNavigate } from "react-router";
import { ArrowRight } from 'lucide-react';
import './HeroSection.css'
import EmergencyModal from '../EmergencyModal/EmergencyModal';
import { toast } from 'react-toastify';

const HeroSection = () => {
    const { isLogged } = useAuth();

    const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleBookingClick = () => {
        if (isLogged) {
            navigate("/book-appointment");
        } else {
            toast.warning("You must be logged in to book an appointment.");
            navigate("/login", {
                state: { from: "/" }
            });
        }
    };

    return (
        <section className="hero" id="home">
            <div className="hero-bg"></div>
            <div className="hero-overlay"></div>
            <div className="container">
                <div className="hero-content">
                    <h1 className="hero-title">Quality Health Care for the Entire Family</h1>
                    <p className="hero-text">
                    We provide world-class medical care with advanced technology and expert professionals.
                    Your health and well-being are our top priority.
                    </p>

                    <div className="hero-buttons">
                        <button onClick={handleBookingClick} className="btn btn-primary" aria-label="Book an appointment">
                        Book Appointment
                        <ArrowRight size={20} />
                        </button>
                        <button 
                        className="btn btn-danger emergency-btn"
                        onClick={() => setIsEmergencyModalOpen(true)}
                        aria-label="Open emergency contact modal"
                        >
                        24/7 Emergencies
                        </button>
                    </div>
                </div>
            </div>
            <EmergencyModal 
                isOpen={isEmergencyModalOpen}
                onClose={() => setIsEmergencyModalOpen(false)}
            />
        </section>
    )
}

export default HeroSection