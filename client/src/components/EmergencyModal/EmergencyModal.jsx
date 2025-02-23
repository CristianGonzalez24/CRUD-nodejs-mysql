import { Phone, MapPin, Ambulance, X } from 'lucide-react';
import './EmergencyModal.css'

const EmergencyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const emergencyNumbers = [
        { label: 'Emergency Ambulance', number: '911' },
        { label: 'Hospital Hotline', number: '(555) 123-4567' },
        { label: 'Poison Control', number: '1-800-222-1222' }
    ];
    
    const nearbyHospitals = [
    {
        name: 'MediCare Main Hospital',
        address: '123 Healthcare Ave, Medical District',
        distance: '0.5 miles',
        phone: '(555) 123-4567'
    },
    {
        name: 'City General Hospital',
        address: '456 Emergency Rd, Downtown',
        distance: '1.2 miles',
        phone: '(555) 987-6543'
    }
    ];

    return (
        <div className="emergency-modal-overlay">
            <div className="emergency-modal">
                <button className="emergency-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="emergency-header">
                    <Ambulance size={32} />
                    <h2>Emergency Services</h2>
                </div>

                <div className="emergency-content">
                    <section className="emergency-section">
                        <h3>Emergency Numbers</h3>
                        <div className="emergency-numbers">
                            {emergencyNumbers.map((item, index) => (
                                <a
                                key={index}
                                href={`tel:${item.number.replace(/[^0-9]/g, '')}`}
                                className="emergency-contact-item"
                                >
                                <Phone size={20} />
                                <div>
                                    <p className="contact-label">{item.label}</p>
                                    <p className="contact-number">{item.number}</p>
                                </div>
                                </a>
                            ))}
                        </div>
                    </section>

                    <section className="emergency-section">
                        <h3>Nearest Hospitals</h3>
                        <div className="nearby-hospitals">
                        {nearbyHospitals.map((hospital, index) => (
                            <div key={index} className="hospital-item">
                            <MapPin size={20} />
                            <div>
                                <h4>{hospital.name}</h4>
                                <p>{hospital.address}</p>
                                <p className="hospital-distance">{hospital.distance}</p>
                                <a href={`tel:${hospital.phone.replace(/[^0-9]/g, '')}`}>
                                {hospital.phone}
                                </a>
                            </div>
                            </div>
                        ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default EmergencyModal