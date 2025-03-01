import { Link } from "react-scroll";
import { Facebook, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css'

const Footer = () => {
    return (
        <footer className="footer" id="contact">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-section">
                        <h3>Contact Us</h3>
                        <div className="footer-contact">
                            <div className="contact-item">
                                <MapPin />
                                <p>
                                123 Healthcare Ave<br />
                                Medical District<br />
                                New York, NY 10001
                                </p>
                            </div>
                            <div className="contact-item">
                                <Phone />
                                <p>+1 (555) 123-4567</p>
                            </div>
                            <div className="contact-item">
                                <Mail />
                                <p>info@medicare.com</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul className="footer-links">
                            <li><Link to="home" smooth={true} duration={500}>About Us</Link></li>
                            <li><Link to="services" smooth={true} duration={500}>Our Services</Link></li>
                            <li><Link to="doctors" smooth={true} duration={500}>Find a Doctor</Link></li>
                            <li><a href="#" onClick={(e) => e.preventDefault()}>Appointments</a></li>
                            <li><a href="#" onClick={(e) => e.preventDefault()}>Career</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Connect With Us</h3>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Facebook"><Facebook /></a>
                            <a href="#" className="social-link" aria-label="Twitter"><Twitter /></a>
                            <a href="#" className="social-link" aria-label="LinkedIn"><Linkedin /></a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3>Newsletter</h3>
                        <p>Subscribe to our newsletter for health tips and updates.</p>
                        <form className="newsletter-form">
                            <label htmlFor="newsletter-email" className="visually-hidden">
                                Enter your email address
                            </label>
                            <input
                                type="email"
                                id="newsletter-email"
                                placeholder="Enter your email"
                                className="newsletter-input"
                                required
                            />
                            <button type="submit" className="btn btn-primary" aria-label="Subscribe to newsletter">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} MediCare. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer