import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HeroSection from './components/HeroSection/HeroSection';
import ServicesSection from './components/ServicesSection/ServicesSection';
import DoctorSection from './components/DoctorSection/DoctorSection';

function App() {

  return (
    <>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <DoctorSection />
      <Footer />
    </>
  )
}

export default App
