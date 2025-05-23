import { Stethoscope, Heart, Brain, Eye, Laugh, BriefcaseMedical, ArrowRight } from 'lucide-react';
import './ServicesSection.css'
import { Link } from 'react-router';

const services = [
    {
        icon: <Stethoscope size={32} />,
        title: 'General Medicine',
        description: 'Comprehensive medical care for the entire family with experienced professionals.',
    },
    {
        icon: <Heart size={32} />,
        title: 'Cardiology',
        description: 'Advanced diagnosis and treatment of cardiovascular diseases.',
    },
    {
        icon: <Brain size={32} />,
        title: 'Neurology',
        description: 'Specialists in the diagnosis and treatment of neurological disorders.',
    },
    {
        icon: <Eye size={32} />,
        title: 'Ophthalmology',
        description: 'Comprehensive eye health care with cutting-edge technology.',
    },
    {
        icon: <Laugh size={32} />,
        title: 'Dentistry',
        description: 'Comprehensive dental services for a healthy, bright smile.',
    },
    {
        icon: <BriefcaseMedical size={32} />,
        title: 'Emergencies',
        description: 'Emergency service available 24/7 with highly trained personnel.',
    },
];

const ServicesSection = () => {
    return (
        <section className="services" id="services">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Our Services</h2>
                    <p className="section-description">
                    We offer a wide range of specialized medical services with the highest quality standards.
                    </p>
                </div>

                <div className="services-grid" role="list">
                    {services.map((service, index) => (
                        <div key={index} className="service-card" role="listitem">
                            <div className="service-icon">{service.icon}</div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                            <Link
                            to={`/doctors?specialty=${encodeURIComponent(service.title)}`}
                            className="service-link"
                            aria-label={`View Doctors for ${service.title}`}
                            >
                            View Doctors <ArrowRight size={16} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ServicesSection