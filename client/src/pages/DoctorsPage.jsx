import { useState, useMemo, useEffect } from 'react'
import { useDoctors } from '../hooks/useDoctors.js';
import DoctorCard from '../components/DoctorCard/DoctorCard';
import DoctorFilter from '../components/DoctorFilter/DoctorFilter';
import './styles/DoctorsPage.css'

const DoctorsPage = () => {
    const { doctors, getDoctors } = useDoctors();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');
    const [selectedExperience, setSelectedExperience] = useState('all');

    useEffect(() => {
        getDoctors();
    }, []);

    const filteredDoctors = useMemo(() => {
        return doctors.filter(doctor => {
            const matchesSearch = 
                doctor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;

            let matchesExperience = true;
            if (selectedExperience !== 'all') {
                const [min, max] = selectedExperience.split('-').map(Number);
                matchesExperience = doctor.years_of_experience >= min && doctor.years_of_experience <= max;
            }

            return matchesSearch && matchesSpecialty && matchesExperience;
        });
    }, [doctors, searchTerm, selectedSpecialty, selectedExperience]);

    return (
        <div className="doctors-page">
            <div className="container">
                <div className="page-header">
                    <h1>Our Doctors</h1>
                    <p>
                    Our team of experts is dedicated to providing you with the highest quality medical care.<br />
                    Whether you need a routine check-up or a complex medical condition, we have the knowledge and experience to help you.<br />
                    </p>
                </div>

                <div className="filters-section">
                    <DoctorFilter 
                        doctors={doctors}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedSpecialty={selectedSpecialty}
                        setSelectedSpecialty={setSelectedSpecialty}
                        selectedExperience={selectedExperience}
                        setSelectedExperience={setSelectedExperience}
                    />
                </div>

                {filteredDoctors.length > 0 ? (
                    <div className="doctors-grid">
                    {filteredDoctors.map(doctor => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>No se encontraron médicos que coincidan con los criterios de búsqueda.</p>
                    </div>
                )
                }
            </div>
        </div>
    )
}

export default DoctorsPage