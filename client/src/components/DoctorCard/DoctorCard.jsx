import './DoctorCard.css'
import { Mail, Phone, Calendar, Award } from 'lucide-react';

const DoctorCard = ({doctor}) => {
    return (
        <div className="doctor-card">
            <div className="doctor-image-container">
                <img
                    // src={doctor.image}
                    className="doctor-image"
                />
                <div className="doctor-availability">
                    <Calendar size={16} />
                    <span>Monday to Friday</span>
                </div>
            </div>
            <div className="doctor-info">
                <h3 className="doctor-name">{doctor.first_name} {doctor.last_name}</h3>
                <p className="doctor-specialization">{doctor.specialty}</p>
                <div className="doctor-experience">
                    <Award size={16} />
                    <span>{doctor.years_of_experience} {doctor.years_of_experience === 1 ? 'year' : 'years'} of experience</span>
                </div>
                <div className="doctor-contact">
                {doctor.email && (
                    <a href={`mailto:${doctor.email}`} className="doctor-contact-item">
                    <Mail size={16} />
                    <span>{doctor.email}</span>
                    </a>
                )}
                {doctor.phone && (
                    <a href={`tel:${doctor.phone}`} className="doctor-contact-item">
                    <Phone size={16} />
                    <span>{doctor.phone}</span>
                    </a>
                )}
                </div>
            </div>
        </div>
    )
}

export default DoctorCard