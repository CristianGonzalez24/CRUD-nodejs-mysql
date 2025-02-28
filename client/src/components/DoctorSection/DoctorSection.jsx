import { useEffect } from 'react';
import { Link } from "react-router";
import { useDoctors } from '../../hooks/useDoctors.js';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";  
import "slick-carousel/slick/slick-theme.css";  
import './DoctorSection.css'
import DoctorCard from '../DoctorCard/DoctorCard';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const DoctorSection = () => {
    const { doctors, loading, getDoctors } = useDoctors();

    useEffect(() => {
        getDoctors();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            }
            },
            {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
            }
        ]
    };

    if (loading) {
        return (
            <section className="doctors" id="doctors">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Doctors</h2>
                    </div>

                    <div className="loading-container">
                        <LoadingSpinner size="large" color="primary" />
                    </div>
                </div>
            </section>
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

                <div className="doctors-carousel">
                    <Slider {...settings}>
                        {doctors?.map((doctor, index) => (
                        <div key={index} className="doctor-slide">
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        </div>
                        ))}
                    </Slider>
                </div>

                <div className="doctors-footer">
                    <Link to="/doctors" className="btn btn-primary view-all-btn">
                        View All Doctors
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default DoctorSection