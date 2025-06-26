import { Link } from 'react-router';
import { useDoctors } from '../../hooks/useDoctors.js';
import './ServicesSection.css'
import { Stethoscope, Heart, Brain, Eye, Laugh, BriefcaseMedical, ArrowRight, Baby, Bone, Syringe, Bandage, Microscope, Activity, Pill, ClipboardPlus } from 'lucide-react';

const ServicesSection = () => {
    const { specializations } = useDoctors();

    const getIcon = (name) => {
        switch (name) {
            case 'Cardiology':
                return <Heart size={32} />;
            case 'Neurology':
                return <Brain size={32} />;
            case 'Ophthalmology':
                return <Eye size={32} />;
            case 'Internal Medicine':
                return <BriefcaseMedical size={32} />;
            case 'General Surgery':
                return <Stethoscope size={32} />;
            case 'Pediatrics':
                return <Baby size={32}/>;
            case 'Orthopedics':
                return <Bone size={32} />;
            case 'Endocrinology':
                return <Syringe size={32}/>;
            case 'Dermatology':
                return <Bandage size={32}/>;
            case 'Urology':
                return <Microscope size={32}/>;
            case 'Pulmonology':
                return <Activity size={32} />;
            case 'Psychiatry':
                return <Pill size={32} />;
            default:
                return <ClipboardPlus size={32} />;
        }
    }
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
                    {!specializations || specializations.length === 0 ? (
                        <div className="no-results">
                            <p>No services available at the moment.</p>
                        </div>
                    ) : (
                        specializations.map((service, index) => (
                            <div key={index} className="service-card" role="listitem">
                                <div className="service-icon">{getIcon(service.name)}</div>
                                <h3 className="service-title">{service.name}</h3>
                                <p className="service-description">{service.description}</p>
                                <Link
                                to={`/doctors?specialty=${encodeURIComponent(service.name)}`}
                                className="service-link"
                                aria-label={`View Doctors for ${service.name}`}
                                >
                                    View Doctors <ArrowRight size={16} />
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}

export default ServicesSection