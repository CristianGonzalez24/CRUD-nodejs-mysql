import { Link } from "react-router";
import { Home, ArrowLeft, Search } from 'lucide-react';
import './styles/NotFound.css'

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <section aria-labelledby="not-found-title">
                    <div className="not-found-illustration">
                        <div className="error-code">404</div>
                        <div className="error-circle"></div>
                    </div>

                    <h1 id="not-found-title" className="not-found-title">Page Not Found</h1>
                    <p className="not-found-message">
                        The page you are looking for might have been removed, had its name changed, 
                        or is temporarily unavailable.
                    </p>
                </section>

                <div className="not-found-actions">
                    <Link to="/" className="not-found-btn primary">
                        <Home size={18} />
                        <span>Back to Home</span>
                    </Link>
                    
                    <Link to={-1} className="not-found-btn secondary">
                        <ArrowLeft size={18} />
                        <span>Go Back</span>
                    </Link>
                </div>

                <div className="not-found-help">
                    <p>Need assistance? <a href="#contact" className="help-link">Contact our support team</a></p>
                </div>
            </div>
        </div>
    )
}

export default NotFound