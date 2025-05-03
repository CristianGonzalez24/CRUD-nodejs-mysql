import { useState, useEffect, useMemo } from "react";
import { useDoctors } from './../hooks/useDoctors';
import { Calendar, Clock, User, Phone, Mail, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import './styles/AppointmentPage.css'
import ConfirmationModal from '../components/ConfirmationModal/ConfirmationModal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DoctorFilter from '../components/DoctorFilter/DoctorFilter';

const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
];
const availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const getRandomAvailableDays = () => {
    const shuffled = [...availableDays].sort(() => 0.5 - Math.random());
    const randomDays = shuffled.slice(0, Math.floor(Math.random() * 3) + 1);
    return randomDays.join(", ");
};

const AppointmentPage = () => {
    const { doctors } = useDoctors();

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        reason: ''
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!selectedDoctor) {
            newErrors.doctor = 'Please select a doctor';
        }
        
        if (!selectedDate) {
            newErrors.date = 'Please select a date';
        }
        
        if (!selectedTime) {
            newErrors.time = 'Please select a time';
        }
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.trim())) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!formData.reason.trim()) {
            newErrors.reason = 'Please provide a reason for your visit';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            const firstError = document.querySelector('.error-message');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
    
        setIsSubmitting(true);
    
        try {
          // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setShowModal(true);
            
            // Reset form
            setSelectedDoctor(null);
            setSelectedDate('');
            setSelectedTime('');
            setFormData({
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            reason: ''
            });
        } catch (error) {
            setErrors(prev => ({
            ...prev,
            submit: 'Failed to book appointment. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
            ...prev,
            [name]: ''
            }));
        }
    };
    const filterDoctorsForSelection = useMemo(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();

        return doctors.filter(doctor => {
            const matchesSearch = 
                doctor.first_name.toLowerCase().includes(lowerSearchTerm) ||
                doctor.specialty.toLowerCase().includes(lowerSearchTerm);

            const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;

            return matchesSearch && matchesSpecialty;
        });
    }, [doctors, searchTerm, selectedSpecialty]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="appointment-page">
            <div className="appointment-header">
                <h1>Book Your Appointment</h1>
                <p>Schedule a consultation with our healthcare professionals</p>
            </div>

            <div className="appointment-container">
                <form onSubmit={(e) => e.preventDefault()} className="appointment-grid" noValidate>
                    <div className="appointment-section">
                        <h2>Select Doctor</h2>
                        {errors.doctor && (
                            <span className="error-message">
                                <AlertCircle size={16} />
                                {errors.doctor}
                            </span>
                        )}
                        <div className="filters-section">
                            <DoctorFilter
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedSpecialty={selectedSpecialty}
                            setSelectedSpecialty={setSelectedSpecialty}
                            hideExperience={true}
                            />
                        </div>

                        <div className="doctor-selection">
                            {filterDoctorsForSelection.length > 0 ? (
                                    filterDoctorsForSelection.map(doctor => (
                                        <div
                                        key={doctor.id}
                                        className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedDoctor(doctor)}
                                        >
                                            <img className="doctor-image appointment-image" />
                                            <div className="doctor-info">
                                                <h3 className="doctor-name">{`${doctor.first_name} ${doctor.last_name}`}</h3>
                                                <p className="doctor-specialization">{doctor.specialty}</p>
                                                <div className="doctor-available">
                                                    <Calendar size={16} />
                                                    <span>Available: {getRandomAvailableDays()}</span>
                                                </div>
                                                {selectedDoctor?.id === doctor.id && (
                                                    <div className="selected-indicator">
                                                        <CheckCircle size={20} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))                   
                            ) : (
                                <div className="no-results">
                                    <p>No doctors found.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="appointment-section">
                        <h2>Choose Date & Time</h2>
                        <div className="datetime-selection">
                            <div className="date-picker">
                                <Calendar size={20} />
                                <DatePicker 
                                    selected={selectedDate} 
                                    onChange={(date) => setSelectedDate(date)}
                                    minDate={new Date()}
                                    dateFormat="yyyy-MM-dd"
                                    className={`custom-datepicker ${errors.date ? 'error' : ''}`}
                                    placeholderText="Select a date"
                                    isClearable
                                    filterDate={(date) => {
                                        const day = date.getDay();
                                        return day !== 0 && day !== 6;
                                    }}
                                    monthsShown={isMobile ? 1 : 2}
                                    withPortal={isMobile}
                                />
                                {errors.date && (
                                <span className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.date}
                                </span>
                                )}
                            </div>

                            <div className="time-slots">
                                {availableTimes.map((time) => (
                                <button
                                    key={time}
                                    type="button"
                                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    <Clock size={16} />
                                    {time}
                                </button>
                                ))}
                                {errors.time && (
                                <span className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.time}
                                </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="appointment-section">
                        <h2>Patient Information</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>
                                <User size={18} />
                                First Name
                                </label>
                                <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="Enter first name"
                                className={errors.firstName ? 'error' : ''}
                                />
                                {errors.firstName && (
                                <span className="error-message">
                                    <AlertCircle size={16} />
                                    {errors.firstName}
                                </span>
                                )}
                            </div>

                        <div className="form-group">
                            <label>
                            <User size={18} />
                            Last Name
                            </label>
                            <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter last name"
                            className={errors.lastName ? 'error' : ''}
                            />
                            {errors.lastName && (
                            <span className="error-message">
                                <AlertCircle size={16} />
                                {errors.lastName}
                            </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>
                            <Phone size={18} />
                            Phone Number
                            </label>
                            <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                            className={errors.phone ? 'error' : ''}
                            />
                            {errors.phone && (
                            <span className="error-message">
                                <AlertCircle size={16} />
                                {errors.phone}
                            </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>
                            <Mail size={18} />
                            Email Address
                            </label>
                            <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email address"
                            className={errors.email ? 'error' : ''}
                            />
                            {errors.email && (
                            <span className="error-message">
                                <AlertCircle size={16} />
                                {errors.email}
                            </span>
                            )}
                        </div>

                        <div className="form-group full-width">
                            <label>
                            <FileText size={18} />
                            Reason for Visit
                            </label>
                            <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            placeholder="Please describe your symptoms or reason for visit"
                            rows={4}
                            className={errors.reason ? 'error' : ''}
                            />
                            {errors.reason && (
                            <span className="error-message">
                                <AlertCircle size={16} />
                                {errors.reason}
                            </span>
                            )}
                        </div>
                    </div>

                        {errors.submit && (
                        <div className="submit-error">
                            <AlertCircle size={18} />
                            {errors.submit}
                        </div>
                        )}

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <ConfirmationModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Appointment Booked Successfully"
            message={`Your appointment has been scheduled with ${selectedDoctor?.name} for ${selectedDate} at ${selectedTime}.`}
            type="success"
            confirmText="Done"
            />
        </div>
    )
}

export default AppointmentPage