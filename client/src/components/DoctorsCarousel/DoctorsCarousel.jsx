import { useMemo } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";  
import "slick-carousel/slick/slick-theme.css";  
import DoctorCard from '../DoctorCard/DoctorCard';

const DoctorsCarousel = ({ doctors }) => {

    if(!doctors || doctors.length === 0) {
        return (
            <div className="no-results">
                <p>No doctors available at the moment.</p>
            </div>
        )
    }
    const settings = useMemo(() => ({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ]
    }), []);

    return (
        <Slider {...settings}>
            {doctors.map((doctor) => (
                <div key={doctor.id} className="doctor-slide">
                    <DoctorCard doctor={doctor} />
                </div>
            ))}
        </Slider>
    )
}

export default DoctorsCarousel