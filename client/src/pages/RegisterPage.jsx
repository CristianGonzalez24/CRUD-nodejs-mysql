import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, AlertCircle, Github, Chrome, Twitter, Facebook, Linkedin, Loader } from 'lucide-react';
import AlertMessage from '../components/AlertMessage/AlertMessage';
import './styles/RegisterPage.css'


const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        acceptTerms: false,
//      subscribeNewsletter: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        uppercase: false,
        number: false,
        special: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const validatePassword = (password) => {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        };
    
        const strength = Object.values(checks).filter(Boolean).length;
    
        return { strength, checks };
    };

    const getStrengthColor = (level) => {
        switch (level) {
            case 1: return '#ff4d4d';      
            case 2: return '#ffd700';       
            case 3: return '#2ecc71';       
            case 4: return '#27ae60';       
            default: return '#ddd';         
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
    
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    
        if (errors[name]) {
            setErrors(prev => ({
            ...prev,
            [name]: ''
            }));
        }
    
        if (name === 'password') {
            const { strength, checks } = validatePassword(value);
            setPasswordStrength(strength);
            setPasswordChecks(checks);
        }
    };

    const validateForm = () => {
        const newErrors = {};
    
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters long and include one uppercase letter, one number, and one special character';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'user',
            acceptTerms: false
        });
        setPasswordStrength(0);
        setPasswordChecks({
            length: false,
            uppercase: false,
            number: false, 
            special: false 
        })
        setErrors({});
        // subscribeNewsletter: false
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        setShowSuccess(false);
        
        try {
        //   const result = await registerUser(formData); 
            console.log('Form data:', formData);
        
            if (result.success) {
                setShowSuccess(true);
                resetForm();

                setTimeout(() => {
                    navigate("/login");
                }, 5000);
            } else {
                setErrors(prev => ({
                    ...prev,
                    submit: result.error
                }));
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: 'Registration failed. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h1>Create Account</h1>
                    <p>Join our healthcare community</p>
                </div>

                <div className="social-login">
                    <button className="social-btn google">
                        <box-icon name='google' type='logo' color='#ffffff'></box-icon>
                        <span>Sign up with Google</span>
                    </button>
                    <button className="social-btn facebook">
                        <box-icon type='logo' name='facebook' color='#ffffff'></box-icon>
                        <span>Sign up with Facebook</span>
                    </button>
                    <button className="social-btn github">
                        <box-icon type='logo' name='github' color='#ffffff'></box-icon>
                        <span>Sign up with Github</span>
                    </button>
                    <button className="social-btn twitter">
                        <box-icon type='logo' name='twitter' color='#ffffff'></box-icon>
                        <span>Sign up with Twitter</span>
                    </button>
                    <button className="social-btn discord">
                    <box-icon name='discord-alt' type='logo' color='#ffffff'></box-icon>
                        <span>Sign up with Discord</span>
                    </button>
                    <button className="social-btn apple">
                        <box-icon type='logo' name='apple' color='#ffffff'></box-icon>
                        <span>Sign up with Apple</span>
                    </button>
                </div>

                <div className="divider">
                    <span>or register with email</span>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {showSuccess && (
                        <AlertMessage
                            type="success"
                            // message="Registration successful! Please check your email to verify your account."
                            message="Registration successful! Redirecting to login page..."
                            duration={4000}
                        />
                    )}
                    {errors.submit && (
                        <AlertMessage
                            type="error"
                            message={errors.submit}
                            duration={6000}
                        />
                    )}

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className={errors.username ? 'error' : ''}
                        aria-invalid={errors.username ? 'true' : 'false'}
                        aria-describedby={errors.username ? 'username-error' : undefined}
                        />
                        {errors.username && (
                        <span className="error-text" id="username-error" role="alert">
                            <AlertCircle size={16} />
                            {errors.username}
                        </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className={errors.email ? 'error' : ''}
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                        {errors.email && (
                        <span className="error-text" id="email-error" role="alert">
                            <AlertCircle size={16} />
                            {errors.email}
                        </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className={errors.password ? 'error' : ''}
                            aria-invalid={errors.password ? 'true' : 'false'}
                            aria-describedby={errors.password ? 'password-error' : undefined}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={20} tabIndex={-1} /> : <Eye size={20} tabIndex={-1} />}
                        </button>
                        </div>

                        <div className="password-strength">
                                <div className="strength-bars">
                                    {[...Array(4)].map((_, index) => (
                                    <div
                                        key={index}
                                        className={`strength-bar ${index < passwordStrength ? 'filled' : ''}`}
                                        style={{
                                            backgroundColor: index < passwordStrength
                                                ? getStrengthColor(passwordStrength)
                                                : '#ddd',
                                            transitionDelay: `${index * 100}ms`
                                        }}
                                    />
                                    ))}
                                </div>
                                <span className="strength-text">
                                    {passwordStrength === 0 && 'Weak'}
                                    {passwordStrength === 1 && 'Fair'}
                                    {passwordStrength === 2 && 'Good'}
                                    {passwordStrength === 3 && 'Strong'}
                                    {passwordStrength === 4 && 'Very Strong'}
                                </span>
                                <ul className="password-checklist">
                                    <li className={passwordChecks.length ? 'valid' : ''}>At least 8 characters</li>
                                    <li className={passwordChecks.uppercase ? 'valid' : ''}>At least one uppercase letter</li>
                                    <li className={passwordChecks.number ? 'valid' : ''}>At least one number</li>
                                    <li className={passwordChecks.special ? 'valid' : ''}>At least one special character</li>
                                </ul>
                        </div>
                        {errors.password && (
                        <span className="error-text" id="password-error" role="alert">
                            <AlertCircle size={16} />
                            {errors.password}
                        </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="password-input">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className={errors.confirmPassword ? 'error' : ''}
                            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                            {showConfirmPassword ? <EyeOff size={20} tabIndex={-1} /> : <Eye size={20} tabIndex={-1} />}
                        </button>
                        </div>
                        {errors.confirmPassword && (
                        <span className="error-text" id="confirm-password-error" role="alert">
                            <AlertCircle size={16} />
                            {errors.confirmPassword}
                        </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Account Type</label>
                        <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* <div className="checkbox-group">
                        <label className="checkbox-label" htmlFor="rememberMe">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleInputChange}
                        />
                        <span className="checkbox-text">Remember me</span>
                        </label>
                    </div> */}

                    <div className="checkbox-group">
                        <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            aria-invalid={errors.acceptTerms ? 'true' : 'false'}
                        />
                        <span className="checkbox-text">
                            I accept the <Link to="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</Link>
                        </span>
                        </label>
                        {errors.acceptTerms && (
                        <span className="error-text" role="alert">
                            <AlertCircle size={16} />
                            {errors.acceptTerms}
                        </span>
                        )}
                    </div>

                    {/* 
                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                            type="checkbox"
                            name="subscribeNewsletter"
                            checked={formData.subscribeNewsletter}
                            onChange={handleInputChange}
                            />
                            <span className="checkbox-text">
                            I want to receive news and promotions by email
                            </span>
                        </label>
                    </div> 
                    */}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting}
                    >
                    {isSubmitting ? (
                    <>
                        <Loader className="spinner" size={20} />
                        <span>Registering...</span>
                    </>
                    ) : (
                        'Register'
                    )}
                    </button>
                </form>
                <p className="login-link">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    )
}

export default Register