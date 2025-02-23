import './DoctorCard.css'

const DoctorCard = ({doctor}) => {
    return (
        <div className="doctor-card">
            <img
                // src={doctor.image}
                className="doctor-image"
            />
            <div className="doctor-info">
                <h3 className="doctor-name">{doctor.first_name} {doctor.last_name}</h3>
                <p className="doctor-specialization">{doctor.specialty}</p>
                <p className="doctor-experience">
                {doctor.years_of_experience} {doctor.years_of_experience === 1 ? 'año' : 'años'} de experiencia
                </p>
            </div>
        </div>
    )
}

export default DoctorCard