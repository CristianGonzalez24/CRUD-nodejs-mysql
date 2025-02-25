import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react';
import './DoctorFilter.css'

const DoctorFilter = ({ doctors, searchTerm, setSearchTerm, selectedSpecialty, setSelectedSpecialty, selectedExperience, setSelectedExperience}) => {
    const specializations = [...new Set(doctors.map(doctor => doctor.specialty))];

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const experienceRanges = [
        { label: 'All Experience', value: 'all' },
        { label: '0-5 years', min: 0, max: 5 },
        { label: '6-10 years', min: 6, max: 10 },
        { label: '11-15 years', min: 11, max: 15 },
        { label: '15+ years', min: 16, max: Infinity }
    ];

    return (
        <div className="search-container">
            <div className="search-doctor">
                <Search className="search-icon" size={20} />
                <input
                type="text"
                placeholder="Search by name..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <button
            className="filter-toggle-btn"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
            <SlidersHorizontal size={20} />
            Filters
            </button>

            <div className={`filters-container ${isFilterOpen ? 'open' : ''}`}>
                <select
                className="filter-select"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                <option value="all">All Specialties</option>
                {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
                ))}
                </select>

                <select
                className="filter-select"
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                >
                {experienceRanges.map(range => (
                    <option key={range.label} value={range.value === 'all' ? 'all' : `${range.min}-${range.max}`}>
                    {range.label}
                    </option>
                ))}
                </select>
            </div>
        </div>
    )
}

export default DoctorFilter