import { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from "react-router";
import { Link } from "react-scroll";
import { Menu, X, Stethoscope } from 'lucide-react';
import './navbar.css'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <RouterLink to="/" className="navbar-brand">
                    <Stethoscope />
                    <span>MediCare</span>
                </RouterLink>

                <button
                className="mobile-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
                
                <div className="navbar-links">
                    <Link to="home" smooth={true} duration={500} className="navbar-link">Home</Link>
                    <Link to="services" smooth={true} duration={500} className="navbar-link">Services</Link>
                    <Link to="doctors" smooth={true} duration={500} className="navbar-link">Doctors</Link>
                    <Link to="contact" smooth={true} duration={500} className="navbar-link">Contact</Link>
                    <button className="btn btn-primary">Book Appointment</button>
                </div>

                {isOpen && (
                <div 
                    ref={menuRef}
                    className="navbar-menu" 
                    role="menu"
                >
                    <Link to="home" smooth={true} duration={500} onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="services" smooth={true} duration={500} onClick={() => setIsOpen(false)}>Services</Link>
                    <Link to="doctors" smooth={true} duration={500} onClick={() => setIsOpen(false)}>Doctors</Link>
                    <Link to="contact" smooth={true} duration={500} onClick={() => setIsOpen(false)}>Contact</Link>
                    <button className="btn btn-primary">Book Appointment</button>
                </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar