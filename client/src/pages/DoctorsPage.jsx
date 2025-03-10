import { useState, useMemo, useEffect, useCallback } from 'react'
import { useDoctors } from '../hooks/useDoctors.js';
import DoctorCard from '../components/DoctorCard/DoctorCard';
import DoctorFilter from '../components/DoctorFilter/DoctorFilter';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import Pagination from '../components/Pagination/Pagination';
import './styles/DoctorsPage.css'

const DoctorsPage = () => {
    const { doctors, getDoctors, loading, isAdmin } = useDoctors();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');
    const [selectedExperience, setSelectedExperience] = useState('all');
    const [showInactive, setShowInactive] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [inactivePage, setInactivePage] = useState(1);

    const doctorsPerPage = 8;

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

        return doctors
        .filter(doctor => doctor.is_active === 1)
        .filter(doctor => {
            const matchesSearch = 
                doctor.first_name.toLowerCase().includes(lowerSearchTerm) ||
                doctor.specialty.toLowerCase().includes(lowerSearchTerm);

            const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;

            const matchesExperience = doctor.years_of_experience >= minExperience && doctor.years_of_experience <= maxExperience;

            return matchesSearch && matchesSpecialty && matchesExperience;
        });
    }, [doctors, searchTerm, selectedSpecialty, selectedExperience]);

    const inactiveDoctors = useMemo(() => {
        return showInactive ? doctors.filter(doctor => doctor.is_active === 0) : [];
    }, [showInactive, doctors]);

    const totalActivePages = Math.ceil(filteredDoctors.length / doctorsPerPage);
    const totalInactivePages = Math.ceil(inactiveDoctors.length / doctorsPerPage);
    const getCurrentPageItems = (items, page) => {
        const startIndex = (page - 1) * doctorsPerPage;
        return items.slice(startIndex, startIndex + doctorsPerPage);
    };

    
    const currentActiveDoctors = getCurrentPageItems(filteredDoctors, activePage);
    const currentInactiveDoctors = getCurrentPageItems(inactiveDoctors, inactivePage);

    useEffect(() => {
        setActivePage(1);
    }, [searchTerm, selectedSpecialty, selectedExperience]);

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
                    <>
                        <div className="doctors-grid">
                        {currentActiveDoctors.map(doctor => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                        </div>

                        {totalActivePages >= 1 && (
                            <Pagination
                                currentPage={activePage}
                                totalPages={totalActivePages}
                                onPageChange={setActivePage}
                            />
                        )}
                    </>
                ) : (
                    <div className="no-results">
                        <p>No doctors found.</p>
                    </div>
                )}

                

                { isAdmin && (
                    <div className="inactive-doctors-section">
                        <div className="inactive-header">
                            <h2>Inactive Doctors</h2>
                            <button 
                                className="toggle-inactive-btn"
                                onClick={() => setShowInactive(!showInactive)}
                                aria-label={showInactive ? "Hide inactive doctors" : "Show inactive doctors"}
                            >
                                {showInactive ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        {showInactive && (
                            <>
                                <div className="inactive-doctors-grid">
                                    {currentInactiveDoctors.length > 0 ? (
                                        currentInactiveDoctors.map(doctor => (
                                        <DoctorCard key={doctor.id} doctor={doctor} />
                                        )) 
                                    ) : (
                                        <p className="no-inactive-message">No inactive doctors found.</p>
                                    )}
                                </div>

                                {totalInactivePages >= 1 && (
                                    <Pagination
                                    currentPage={inactivePage}
                                    totalPages={totalInactivePages}
                                    onPageChange={setInactivePage}
                                    />
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default DoctorsPage