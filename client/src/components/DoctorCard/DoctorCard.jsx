import { useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { Mail, Phone, Calendar, Award } from 'lucide-react';
import './DoctorCard.css'

const DoctorCard = ({doctor}) => {
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

    return (
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
            </div>
        </div>
    )
}

export default DoctorCard