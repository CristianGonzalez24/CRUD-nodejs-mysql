import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { Link as RouterLink, useNavigate } from "react-router";
import { Link } from "react-scroll";
import { Menu, X, Stethoscope, ChevronDown, User, Calendar, Settings, Contact, LogOut } from 'lucide-react';
import './navbar.css'

const Navbar = () => {
    const { isLogged, isAdmin, user, logoutUser } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLinkClick = () => {
        setIsOpen(false);
        setShowDropdown(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            setShowDropdown(!showDropdown);
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
            setIsOpen(false);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
        setShowDropdown(false);
        setIsOpen(false);
    };    

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="container navbar-container">
                <RouterLink to="/" className="navbar-brand" onClick={handleLinkClick}>
                    <Stethoscope size={24} />
                    <span>MediCare</span>
                </RouterLink>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isOpen}
                    aria-controls="navbar-menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                
                <div id="navbar-menu" className={`navbar-links ${isOpen ? 'active' : ''}`} aria-hidden={!isOpen} ref={menuRef}>
                    <Link to="home" smooth={true} duration={500} className="navbar-link" onClick={handleLinkClick}>Home</Link>
                    <Link to="services" smooth={true} duration={500} className="navbar-link" onClick={handleLinkClick}>Services</Link>
                    <Link to="doctors" smooth={true} duration={500} className="navbar-link" onClick={handleLinkClick}>Doctors</Link>
                    <Link to="contact" smooth={true} duration={500} className="navbar-link" onClick={handleLinkClick}>Contact</Link>
                    
                    { isLogged ? (
                        <>
                            <RouterLink 
                            to="/book-appointment" 
                            aria-label="Book an appointment" 
                            className="btn btn-primary book-btn" 
                            onClick={handleLinkClick}
                            >
                                Book Appointment
                            </RouterLink>

                            <div className="user-profile" ref={dropdownRef}>
                                <button
                                className={`profile-button ${showDropdown ? 'active' : ''}`}
                                onClick={() => setShowDropdown(!showDropdown)}
                                onKeyDown={handleKeyDown}
                                aria-haspopup="true"
                                aria-expanded={showDropdown}
                                >
                                    <div className="avatar">
                                        {user?.avatar ? (
                                            <img
                                            src={user.avatar}
                                            alt={`${user.username}'s avatar`}
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=0066cc&color=fff&length=1&bold=true`;
                                            }}
                                            />
                                        ) : (
                                            <div className="avatar-fallback">
                                            {user?.username?.charAt(0).toUpperCase() || "?"}
                                            </div>
                                        )}
                                    </div>

                                    <span className="user-name">{user?.username}</span>
                                    <ChevronDown size={16} />
                                </button>
                                {showDropdown && (
                                    <div className="dropdown-menu" role="menu" aria-labelledby="user-menu">
                                        <RouterLink to="/my-account" className="dropdown-item" role="menuitem" onClick={handleLinkClick}>
                                            <User size={16} />
                                            <span>My Account</span>
                                        </RouterLink>

                                        <RouterLink to="/my-appointments" className="dropdown-item" role="menuitem" onClick={handleLinkClick}>
                                            <Calendar size={16} />
                                            <span>My Appointments</span>
                                        </RouterLink>

                                        {isAdmin && (
                                        <RouterLink to="/doctors/create" className="dropdown-item" role="menuitem" onClick={handleLinkClick}>
                                            <Contact size={16} />
                                            <span>Create Doctor</span>
                                        </RouterLink>
                                        )}

                                        {isAdmin && (
                                        <RouterLink to="/users-management" className="dropdown-item" role="menuitem" onClick={handleLinkClick}>
                                            <Settings size={16} />
                                            <span>User Management</span>
                                        </RouterLink>
                                        )}

                                        <button onClick={handleLogout} className="dropdown-item" role="menuitem">
                                            <LogOut size={16} />
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <RouterLink to="auth/login" aria-label="Login" className="btn btn-secondary" onClick={handleLinkClick}>Login</RouterLink>
                            <RouterLink to="auth/register" aria-label="Register" className="btn btn-primary" onClick={handleLinkClick}>Register</RouterLink>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar