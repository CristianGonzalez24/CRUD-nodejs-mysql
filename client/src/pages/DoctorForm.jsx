import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router";
import { useDoctors } from '../hooks/useDoctors.js';
import { toast } from 'react-toastify';
import ConfirmationModal from '../components/ConfirmationModal/ConfirmationModal';
import { User, Phone, Mail, ClipboardPlus, Award, AlertCircle } from 'lucide-react';
import './styles/DoctorForm.css'

const specializations = [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Ophthalmology',
    'Dermatology',
    'Traumatology',
    'Gynecology',
    'Psychiatry',
    'Endocrinology',
    'Oncology'
]; 

const DoctorForm = () => {

    const { specializations, addDoctor, fetchDoctorById, updateDoctor } = useDoctors();

    const navigate = useNavigate();

    const { id } = useParams();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        specialization: '',
        phone: '',
        email: '',
        experience: ''
    });

    const [modalType, setModalType] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [createdDoctorName, setCreatedDoctorName] = useState('');

    useEffect(() => {
        if (id) {
            fetchDoctorById(id).then(response => {
                if (response.success) {
                    const doctorData = response.doctor;

                    const formattedDoctorData = {
                        firstName: doctorData.first_name,
                        lastName: doctorData.last_name,
                        specialization: doctorData.specialty,
                        phone: doctorData.phone,
                        email: doctorData.email,
                        experience: String(doctorData.years_of_experience)
                    }

                    setFormData(formattedDoctorData);
                }
            }).catch(error => {
                console.error("Error fetching doctor:", error);
            });
        }
    }, [id]);

    const validateForm = () => {
        const newErrors = {};
    
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required.';
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required.';
        }
        
        if (!formData.specialization) {
            newErrors.specialization = 'Specialization is required.';
        }
    
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.trim())) {
            newErrors.phone = 'Invalid phone number format.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address format.';
        }
        
        const experience = Number(formData.experience);
        if (!formData.experience) {
            newErrors.experience = 'Years of experience is required.';
        } else if (isNaN(experience) || experience < 0) {
            newErrors.experience = 'Experience cannot be negative.';
        }
    
        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setFormErrors(prev => ({
                ...prev,    
                submit: ''
            }))

            const firstError = document.querySelector('.error-message');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
    
        setIsSubmitting(true);
        setFormErrors(prev => ({ ...prev, submit: '' }));

        let result;

        if (isEditing) {
            result = await updateDoctor(id, formData);
        } else {
            result = await addDoctor(formData);
        }

        if (result.success) {
            if (isEditing) {
                toast.success("Doctor updated successfully!");
                navigate('/doctors');
            } else {
                setCreatedDoctorName(`${formData.firstName} ${formData.lastName}`);
                setModalType('success');
                setFormData({
                    firstName: '',
                    lastName: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    experience: ''
                });         
            }
        } else {
            setFormErrors(prev => ({
                ...prev,
                submit: result.error
            }));
        }
        setIsSubmitting(false);
    };
    const handleCancel = () => {
        const hasUnsavedChanges = Object.values(formData).some(value => value.trim() !== '');
    
        if (hasUnsavedChanges) {
            setModalType('cancel');
        } else {
            navigate('/doctors');
        }
    };
    
    const confirmCancel = () => {
        setModalType(null);
        setFormData({
            firstName: '',
            lastName: '',
            specialization: '',
            phone: '',
            email: '',
            experience: ''
        });
        navigate('/doctors');
    };

    const confirmSuccess = () => {
        setModalType(null);
        navigate('/doctors');
    };

    const handleModalClose = () => {
        setModalType(null);
        setCreatedDoctorName('');
    };

    return (
        <div className="doctor-form-container">
            <div className="form-header">
                <h1>Add New Doctor</h1>
                <p>Fill in the details to add a new doctor to the system</p>
            </div>

            <form onSubmit={handleSubmit} className="doctor-form" noValidate>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="firstName" id="firstNameLabel">
                            <User size={18} />
                            First Name
                        </label>
                        <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={formErrors.firstName ? 'error' : ''}
                        aria-labelledby="firstNameLabel"
                        aria-describedby={formErrors.firstName ? 'firstNameError' : ''}
                        aria-invalid={!!formErrors.firstName}
                        />
                        {formErrors.firstName && (
                            <span id="firstNameError" className="error-message">{formErrors.firstName}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName" id="lastNameLabel">
                            <User size={18} />
                            Last Name
                        </label>
                        <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={formErrors.lastName ? 'error' : ''}
                        aria-labelledby="lastNameLabel"
                        aria-describedby={formErrors.lastName ? 'lastNameError' : ''}
                        aria-invalid={!!formErrors.lastName}
                        />
                        {formErrors.lastName && (
                            <span id="lastNameError" className="error-message">{formErrors.lastName}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="specialization" id="specializationLabel">
                            <ClipboardPlus size={18} />
                            Specialization
                        </label>
                        <select
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className={formErrors.specialization ? 'error' : ''}
                        aria-labelledby="specializationLabel"
                        aria-describedby={formErrors.specialization ? 'specializationError' : ''}
                        aria-invalid={!!formErrors.specialization}
                        >
                        <option value="" disabled>Select specialization</option>
                        {specializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                        </select>
                        {formErrors.specialization && (
                            <span id="specializationError" className="error-message">{formErrors.specialization}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone" id="phoneLabel">
                            <Phone size={18} />
                            Phone Number
                        </label>
                        <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={formErrors.phone ? 'error' : ''}
                        aria-labelledby="phoneLabel"
                        aria-describedby={formErrors.phone ? 'phoneError' : ''}
                        aria-invalid={!!formErrors.phone}
                        />
                        {formErrors.phone && (
                            <span id="phoneError" className="error-message">{formErrors.phone}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" id="emailLabel">
                            <Mail size={18} />
                            Email Address
                        </label>
                        <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={formErrors.email ? 'error' : ''}
                        aria-labelledby="emailLabel"
                        aria-describedby={formErrors.email ? 'emailError' : ''}
                        aria-invalid={!!formErrors.email}
                        />
                        {formErrors.email && (
                            <span id="emailError" className="error-message">{formErrors.email}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="experience" id="experienceLabel">
                            <Award size={18} />
                            Years of Experience
                        </label>
                        <input
                        type="number"
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className={formErrors.experience ? 'error' : ''}
                        min="0"
                        aria-labelledby="experienceLabel"
                        aria-describedby={formErrors.experience ? 'experienceError' : ''}
                        aria-invalid={!!formErrors.experience}
                        />
                        {formErrors.experience && (
                            <span id="experienceError" className="error-message">{formErrors.experience}</span>
                        )}
                    </div>
                </div>

                {formErrors.submit && (
                    <div className="submit-error">
                        <AlertCircle size={18} />
                        {formErrors.submit}
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-secondary"
                        aria-label="Cancel and go back to doctors list"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting || Object.values(formErrors).some(error => error)}
                        aria-label="Create new doctor"
                        aria-busy={isSubmitting}
                        aria-disabled={isSubmitting || Object.values(formErrors).some(error => error)}
                    >
                        {isSubmitting ? "Processing..." : isEditing ? "Update Doctor" : "Create Doctor"}
                    </button>
                </div>
            </form>

            {modalType === 'success' && (
                <ConfirmationModal
                isOpen={true}
                onClose={handleModalClose}
                onConfirm={confirmSuccess}
                title={`${createdDoctorName} was added successfully!`}
                message="The new doctor has been added to the system."
                type="success"
                confirmText="Go to Doctors List"
                cancelText="Create another doctor"
                />
            )}
            {modalType === 'cancel' && (
                <ConfirmationModal
                    isOpen={true}
                    onClose={() => setModalType(null)}
                    onConfirm={confirmCancel}
                    title="Unsaved Changes"
                    message="You have unsaved changes. Are you sure you want to leave?"
                    type="warning"
                    confirmText="Yes, leave"
                    cancelText="No, stay"
                />
            )}
        </div>
    )
}

export default DoctorForm