import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import AlertMessage from '../components/AlertMessage/AlertMessage';
import { useAuth } from '../hooks/useAuth.js';
import './styles/LoginPage.css'


const LoginPage = () => {  
    const { loginUser, getUser } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const navigate = useNavigate();

    const [validFields, setValidFields] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        return passwordRegex.test(password);
    };
    
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const valueToValidate = type === 'checkbox' ? checked : value.trim();

        setFormData(prev => ({
            ...prev,
            [name]: valueToValidate
        }));

        if (name === 'email') {
            const isValid = validateEmail(valueToValidate);
            setValidFields(prev => ({ ...prev, email: isValid }));
            if (!isValid && value) {
                setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.email;
                    return newErrors;
                });
            }
        }
    
        if (name === 'password') {
            const isValid = validatePassword(valueToValidate);
            setValidFields(prev => ({ ...prev, password: isValid }));
            if (!isValid && value) {
            setErrors(prev => ({ 
                ...prev, 
                password: 'Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character' 
            }));
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.password;
                    return newErrors;
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (isSubmitting) return;

        setErrors({});
    
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
    
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character';
        }
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        setIsSubmitting(true);
        
        try{
            const result = await loginUser(formData.email, formData.password, formData.rememberMe);

            if (result.success) {
                await getUser();
                setFormData({
                    email: '',
                    password: '',
                    rememberMe: false
                });
                setErrors({});
                navigate('/');
            } else {
                setErrors(prev => ({
                    ...prev,
                    submit: result.error
                }));
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: 'Login failed. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container" data-testid="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue to your account</p>
                </div>

                {errors.submit && (
                    <AlertMessage
                        type="error"
                        message={errors.submit}
                        duration={6000}
                    />
                )}

                <form onSubmit={handleSubmit} className="login-form" noValidate>
                    <div className="form-group">
                        <label htmlFor="email">
                            <Mail size={20} />
                            Email Address
                        </label>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                className={`${errors.email ? 'error' : ''} ${validFields.email ? 'valid' : ''}`}
                                autoComplete="email"
                                aria-invalid={errors.email ? 'true' : 'false'}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                                aria-disabled={isSubmitting}
                                data-testid="email-input"
                            />
                            {validFields.email && <CheckCircle className="valid-icon" size={20} />}
                            {errors.email && <AlertCircle className="error-icon" size={20} />}
                        </div>
                        {errors.email && (
                        <span className="error-message" id="email-error" role="alert">
                            {errors.email}
                        </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <Lock size={20} />
                            Password
                        </label>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                className={errors.password ? 'error' : validFields.password ? 'valid' : ''}
                                autoComplete="current-password"
                                aria-invalid={errors.password ? 'true' : 'false'}
                                aria-describedby={errors.password ? 'password-error' : undefined}
                                aria-disabled={isSubmitting}
                                data-testid="password-input"
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
                        {errors.password && (
                        <span className="error-message" id="password-error" role="alert">
                            {errors.password}
                        </span>
                        )}
                    </div>

                    <div className="form-options">
                        <label className="checkbox-label" htmlFor="rememberMe">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                                aria-label="Remember me"
                                data-testid="remember-me-checkbox"
                            />
                            <span className="checkbox-text">Remember me</span>
                        </label>

                        <Link to="/forgot-password" className="forgot-password">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isSubmitting}
                        data-testid="login-button"
                        aria-busy={isSubmitting}
                        aria-disabled={isSubmitting}
                        aria-label={isSubmitting ? 'Signing in...' : 'Sign in'}
                        tabIndex={isSubmitting ? -1 : 0}
                    >
                        {isSubmitting ? (
                        <>
                            <Loader className="spinner" size={20} />
                            <span>Signing in...</span>
                        </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <p className="log-reg-link">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage