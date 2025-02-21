import React from 'react';
import { useNavigate } from "react-router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";  
import "slick-carousel/slick/slick-theme.css";  
import './DoctorSection.css'

const doctors = [
    {
        name: 'Dra. Ana Martínez',
        specialization: 'Cardiology',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        bio: 'Cardiology specialist with more than 15 years of experience in the diagnosis and treatment of cardiovascular diseases.',
    },
    {
        name: 'Dr. Carlos Ruiz',
        specialization: 'Neurology',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        bio: 'Certified neurologist with extensive experience in the treatment of neurological and neurodegenerative disorders.',
    },
    {
        name: 'Dra. Laura Sánchez',
        specialization: 'Pediatrics',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        bio: 'Pediatrician dedicated to the comprehensive care of children and adolescents, with special emphasis on preventive medicine.',
    },
    {
        name: 'Dr. Miguel Torres',
        specialization: 'Ophthalmology',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        bio: 'Ophthalmologist specializing in laser surgery and cutting-edge treatments for visual health.',
    },
    {
        name: 'Dra. Isabel Moreno',
        specialization: 'Dermatology',
        image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        bio: 'Dermatologist specializing in aesthetic treatments and skin conditions with a focus on preventative medicine.',
    }
];

const DoctorSection = () => {
    const navigate = useNavigate();

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
    
    const handleViewAll = () => {
    navigate('/doctors');
    };

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
                        {doctors.map((doctor, index) => (
                        <div key={index} className="doctor-slide">
                            <div className="doctor-card">
                                <img
                                    src={doctor.image}
                                    alt={doctor.name}
                                    className="doctor-image"
                                />
                                <div className="doctor-info">
                                    <h3 className="doctor-name">{doctor.name}</h3>
                                    <p className="doctor-specialization">{doctor.specialization}</p>
                                    <p className="doctor-bio">{doctor.bio}</p>
                                </div>
                            </div>
                        </div>
                        ))}
                    </Slider>
                </div>

                <div className="doctors-footer">
                    <button onClick={handleViewAll} className="btn btn-primary view-all-btn">
                        View All Doctors
                    </button>
                </div>
            </div>
        </section>
    )
}

export default DoctorSection