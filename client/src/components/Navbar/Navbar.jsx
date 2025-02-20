import React, { useState } from 'react';
import { Menu, X, Stethoscope } from 'lucide-react';
import './navbar.css'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <a href="#" className="navbar-brand">
                    <Stethoscope />
                    <span>MediCare</span>
                </a>

                <button
                className="mobile-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
                
                <div className="navbar-links">
                    <a href="#home" className="navbar-link">Home</a>
                    <a href="#services" className="navbar-link">Services</a>
                    <a href="#doctors" className="navbar-link">Doctors</a>
                    <a href="#contact" className="navbar-link">Contact</a>
                    <button className="btn btn-primary">Book Appointment</button>
                </div>

                {isOpen && (
                <div className="navbar-menu">
                    <a href="#home">Home</a>
                    <a href="#services">Services</a>
                    <a href="#doctors">Doctors</a>
                    <a href="#contact">Contact</a>
                    <button className="btn btn-primary btn-mobile">Book Appointment</button>
                </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar