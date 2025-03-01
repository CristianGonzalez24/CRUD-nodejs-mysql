import { useState, useMemo, useEffect, useCallback } from 'react'
import { useDoctors } from '../hooks/useDoctors.js';
import DoctorCard from '../components/DoctorCard/DoctorCard';
import DoctorFilter from '../components/DoctorFilter/DoctorFilter';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import './styles/DoctorsPage.css'

const DoctorsPage = () => {
    const { doctors, getDoctors, loading } = useDoctors();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');
    const [selectedExperience, setSelectedExperience] = useState('all');

    const fetchDoctors = useCallback(() => {
        if (doctors.length === 0) {
            getDoctors();
        }
    }, [doctors.length, getDoctors]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    const filteredDoctors = useMemo(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        let minExperience = 0, maxExperience = Infinity;

        if (selectedExperience !== 'all') {
            [minExperience, maxExperience] = selectedExperience.split('-').map(Number);
        }
        return doctors.filter(doctor => {
            const matchesSearch = 
                doctor.first_name.toLowerCase().includes(lowerSearchTerm) ||
                doctor.specialty.toLowerCase().includes(lowerSearchTerm);

            const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;

            const matchesExperience = doctor.years_of_experience >= minExperience && doctor.years_of_experience <= maxExperience;

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

                {loading ? (
                    <div className="doctors-grid-loading">   
                        <LoadingSpinner size={50} color="var(--primary-color)" />
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    <div className="doctors-grid">
                    {filteredDoctors.map(doctor => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>No doctors found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DoctorsPage