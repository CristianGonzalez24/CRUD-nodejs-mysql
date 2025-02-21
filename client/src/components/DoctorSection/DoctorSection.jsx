import React from 'react'
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
];
const DoctorSection = () => {
    return (
        <section className="doctors" id="doctors">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Our Doctors</h2>
                    <p className="section-description">
                    We have a team of highly qualified doctors who are committed to your health.
                    </p>
                </div>

                <div className="doctors-grid">
                {doctors.map((doctor, index) => (
                    <div key={index} className="doctor-card">
                    <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="doctor-image"
                    />
                    <div className="doctor-info">
                        <h3 className="doctor-name">{doctor.name}</h3>
                        <p className="doctor-specialization">{doctor.specialization}</p>
                        <p className="doctor-bio">{doctor.bio}</p>
                        <button className="btn btn-primary">Ver Perfil</button>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </section>
    )
}

export default DoctorSection