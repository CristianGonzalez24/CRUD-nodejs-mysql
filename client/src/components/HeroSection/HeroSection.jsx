import React from 'react'
import { ArrowRight } from 'lucide-react';
import './HeroSection.css'

const HeroSection = () => {
    return (
        <section className="hero" id="home">
            <div className="hero-bg"></div>
            <div className="hero-overlay"></div>
            <div className="container">
                <div className="hero-content">
                    <h1 className="hero-title">Quality Health Care for the Entire Family</h1>
                    <p className="hero-text">
                    We provide world-class medical care with advanced technology and expert professionals.
                    Your health and well-being are our top priority.
                    </p>

                    <div className="hero-buttons">
                        <button className="btn btn-primary">
                        Book Appointment
                        <ArrowRight size={20} />
                        </button>
                        <button className="btn btn-danger">24/7 Emergencies</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection