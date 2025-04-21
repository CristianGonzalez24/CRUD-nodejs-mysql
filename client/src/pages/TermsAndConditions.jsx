import './styles/TermsAndConditions.css'

const TermsAndConditions = () => {
    return (
    <div className="terms-container">
        <h1>Terms and Conditions of Use</h1>

        <section>
            <h2>1. Introduction</h2>
            <p>
                Welcome to San Vital Hospital. By accessing and using this website,
                you agree to be bound by the following Terms and Conditions. Please read them carefully before using our services.
            </p>
        </section>

        <section>
            <h2>2. Website Usage</h2>
            <p>
                This website is intended to provide access to healthcare information,
                appointment scheduling, and contact with our medical professionals.
                Any misuse or unauthorized access is strictly prohibited.
            </p>
        </section>

        <section>
            <h2>3. User Registration</h2>
            <p>
                To access certain features, users must register by providing accurate
                and complete personal information. You are responsible for maintaining
                the confidentiality of your account credentials.
            </p>
        </section>

        <section>
            <h2>4. Privacy and Data Protection</h2>
            <p>
                All personal data provided will be handled in accordance with our
                <a href="#"> Privacy Policy</a>. We are committed to safeguarding your information and will not share it without your consent.
            </p>
        </section>

        <section>
            <h2>5. Appointment Cancellations</h2>
            <p>
                Users may cancel or reschedule appointments at least 24 hours in
                advance. The hospital reserves the right to reschedule or cancel
                appointments due to emergencies or unforeseen circumstances.
            </p>
        </section>

        <section>
            <h2>6. Changes to Terms</h2>
            <p>
                These Terms and Conditions may be updated at any time. Updates will
                become effective upon being published on this page. We recommend reviewing this section periodically.
            </p>
        </section>

        <section>
            <h2>7. Contact Information</h2>
            <p>
                For any questions regarding these terms, please contact us at
                <a href="mailto:info@medicare.com"> info@medicare.com </a>
                or visit our administrative office.
            </p>
        </section>

        <p className="last-updated">Last updated: {new Date().toLocaleDateString()} </p>
    </div>
    )
}

export default TermsAndConditions