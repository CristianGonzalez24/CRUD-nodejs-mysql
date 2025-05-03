
import { Link } from "react-router";
import { useDoctors } from '../../hooks/useDoctors.js';
import './DoctorSection.css'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import DoctorsCarousel from './../DoctorsCarousel/DoctorsCarousel';

const DoctorSection = () => {
    const { doctors, loading } = useDoctors();

    const DOCTORS_CAROUSEL_LIMIT = 10;

    const activeDoctors = doctors
        ?.filter(doctor => doctor.is_active === 1)
        .slice(0, DOCTORS_CAROUSEL_LIMIT);

    let content;

    if (loading) {
        content = (
            <div className="loading-container">
                <LoadingSpinner size={50} color="var(--primary-color)" />
            </div>
        )
    } else {
        content = (
            <div className="doctors-carousel">
                <DoctorsCarousel doctors={activeDoctors}/>
            </div>
        )
    }

    return (
        <section className="doctors" id="doctors">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Our Doctors</h2>
                    <p className="section-description">
                    We have a team of highly qualified doctors who are committed to your health.
                    </p>
                </div>

                {content}

                {doctors && doctors.length > DOCTORS_CAROUSEL_LIMIT && 
                    <div className="doctors-footer">
                        <Link to="/doctors" className="btn btn-primary view-all-btn">
                            View All Doctors
                        </Link>
                    </div>
                }
            </div>
        </section>
    )
}

export default DoctorSection