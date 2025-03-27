import { useState, useMemo } from 'react'
import { useDoctors } from '../../hooks/useDoctors.js';
import { Search, SlidersHorizontal } from 'lucide-react';
import './DoctorFilter.css'

const DoctorFilter = ({ searchTerm, setSearchTerm, selectedSpecialty, setSelectedSpecialty, selectedExperience, setSelectedExperience, hideExperience }) => {

    const { specializations } = useDoctors();

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const experienceRanges = [
        { label: 'All Experience', value: 'all' },
        { label: '0-5 years', value: '0-5' },
        { label: '6-10 years', value: '6-10' },
        { label: '11-15 years', value: '11-15' },
        { label: '15+ years', value: '16-Infinity' }
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
                    aria-label="Search by doctor's name"
                />
            </div>

            <button
                className="filter-toggle-btn"
                onClick={() => setIsFilterOpen(prev => !prev)}
                aria-expanded={isFilterOpen}
                aria-label="Toggle filters"
            >
                <SlidersHorizontal size={20} />
                Filters
            </button>

            <div className={`filters-container ${isFilterOpen ? 'open' : ''}`}>
                <label htmlFor="specialty-filter" className="visually-hidden">Filter by specialty</label>
                <select
                    id="specialty-filter"
                    className="filter-select"
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                    <option value="all">All Specialties</option>
                    {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                    ))}
                </select>
                
                {!hideExperience && ( 
                    <>
                    <label htmlFor="experience-filter" className="visually-hidden">Filter by experience</label>
                    <select
                        id="experience-filter"
                        className="filter-select"
                        value={selectedExperience}
                        onChange={(e) => setSelectedExperience(e.target.value)}
                    >
                        {experienceRanges.map(range => (
                            <option key={range.label} value={range.value}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                    </>
                )}
            </div>
        </div>
    )
}

export default DoctorFilter