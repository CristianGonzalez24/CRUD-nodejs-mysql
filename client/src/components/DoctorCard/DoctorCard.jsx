import { useMemo, useCallback, useState } from "react";
import { useDoctors } from '../../hooks/useDoctors.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useNavigate } from "react-router";
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { toast } from "react-toastify";
import { Mail, Phone, Calendar, Award, AlertTriangle } from 'lucide-react';
import './DoctorCard.css'

const DoctorCard = ({doctor}) => {
    const { isAdmin } = useAuth();
    const { deactivateDoctor, activateDoctor, deleteDoctor, loading  } = useDoctors();

    const [showModal, setShowModal] = useState(false);
    const [closing, setClosing] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: 'info',
        onConfirm: () => {},
    });

    const navigate = useNavigate();

    const formattedPhone = useMemo(() => {
        if (!doctor?.phone) return "";
        const digits = doctor.phone.trim();

        if (digits.length === 10) {
            return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
        } else if (digits.length === 11) {
            return `+${digits[0]} ${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
        } else if (digits.length === 12) {
            return `+${digits.slice(0, 2)} ${digits.slice(2, 6)}-${digits.slice(6)}`;
        }

        return doctor.phone;
    }, [doctor?.phone]);

    const handlePhoneClick = useCallback((event) => {
        if (!navigator.userAgent.includes("Mobile")) {
            toast.warning(`Phones cannot be called on this device. Please try manually: ${doctor.phone}`);
            event.preventDefault();
        }
    }, [doctor?.phone]);

    const handleEmailClick = useCallback((event) => {
        if (!navigator.userAgent.includes("Mobile") && !navigator.userAgent.includes("Mac")) {
            toast.warning(`Emails cannot be sent on this device. Please try manually: ${doctor.email}`);
            event.preventDefault();
        }
    }, [doctor?.email]);

    const doctorName = `Dr(a). ${doctor.first_name} ${doctor.last_name}`;

    const handleDeactivate = (doctor) => {
        setModalConfig({
            title: 'Deactivate Doctor',
            message: `Are you sure you want to deactivate ${doctorName}?\nThis will temporarily remove them from the active doctors list.`,
            type: 'warning',
            onConfirm: () => deactivateDoctor(doctor.id),
        });
        setShowModal(true);
    };

    const handleActivate = (doctor) => {
        setModalConfig({
            title: 'Activate Doctor',
            message: `Are you sure you want to activate ${doctorName}?`,
            type: 'success',
            onConfirm: () => activateDoctor(doctor.id),
        });
        setShowModal(true);
    };

    const handleDelete = (doctor) => {
        setModalConfig({
            title: 'Delete Doctor',
            message: `WARNING: You are about to permanently delete ${doctorName}.\n\nThis action cannot be undone. Are you sure you want to continue?`,
            type: 'danger',
            onConfirm: () => deleteDoctor(doctor.id),
            confirmText: 'Delete',
            cancelText: 'Keep',
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        if (loading) return;
        setClosing(true); 
        setTimeout(() => {
            setShowModal(false);
            setClosing(false);
        }, 300);
    };

    return (
        <>
        <div className="doctor-card">
            <div className="doctor-image-container">
                <img
                    // src={doctor.image}
                    className="doctor-image"
                />
                <div className="doctor-availability">
                    <Calendar size={16} />
                    <span>Available</span>
                </div>
            </div>

            <div className="doctor-info">
                <h3 className="doctor-name">{doctor?.first_name} {doctor?.last_name}</h3>
                <p className="doctor-specialization">{doctor?.specialty || "Specialty not specified"}</p>
                {doctor?.years_of_experience && (
                    <div className="doctor-experience">
                        <Award size={16} />
                        <span>{doctor.years_of_experience} {doctor.years_of_experience === 1 ? 'year' : 'years'} of experience</span>
                    </div>
                )}
                <div className="doctor-contact">
                {doctor?.email && (
                    <a href={`mailto:${doctor.email}`} className="doctor-contact-item" onClick={handleEmailClick}>
                        <Mail size={16} />
                        <span>{doctor.email}</span>
                    </a>
                )}
                {doctor?.phone && (
                    <a href={`tel:${doctor.phone}`} className="doctor-contact-item" onClick={handlePhoneClick}>
                        <Phone size={16} />
                        <span>{formattedPhone}</span>
                    </a>
                )}
                </div>

                <div className="doctor-actions">
                    {isAdmin && (
                        doctor?.is_active === 1 ? (
                            <>
                                <button 
                                    className="btn btn-primary doctor-action-btn"
                                    onClick={() => navigate(`/doctors/edit/${doctor.id}`)}
                                    disabled={loading}                            
                                >
                                    Update
                                </button>
                                <button
                                    className="btn btn-secondary doctor-action-btn"
                                    onClick={() => handleDeactivate(doctor)}
                                    disabled={loading}
                                >
                                    Deactivate
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="btn btn-success doctor-action-btn"
                                    onClick={() => handleActivate(doctor)}
                                    disabled={loading}
                                >
                                    Activate
                                </button>
                                <button
                                    className="btn btn-danger doctor-action-btn"
                                    onClick={() => handleDelete(doctor)}
                                    disabled={loading}
                                >
                                    <AlertTriangle size={16} />
                                    Delete   
                                </button>
                            </>
                        )
                    )}
                </div>
            </div>
        </div>

        <ConfirmationModal
            loading={loading}
            isOpen={showModal}
            onClose={handleCloseModal}
            closing={closing}
            title={modalConfig.title}
            message={modalConfig.message}
            type={modalConfig.type}
            onConfirm={modalConfig.onConfirm}
            confirmText={modalConfig.confirmText}
            cancelText={modalConfig.cancelText}
        />
        </>
    );
};

export default DoctorCard