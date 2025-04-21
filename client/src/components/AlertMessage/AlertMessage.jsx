import { useEffect, useState, useRef } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import './AlertMessage.css'

const AlertMessage = ({ type = 'success', message, duration = 4000 }) => {
    const [visible, setVisible] = useState(true);
    const alertRef = useRef();

    useEffect(() => {
        if (visible && alertRef.current) {
            alertRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            alertRef.current.focus();
        }

        if (duration > 0) {
            const timer = setTimeout(() => setVisible(false), duration);
            return () => clearTimeout(timer);
        }
    }, [visible, duration]);

    if (!visible) return null;

    return (
        <div 
            ref={alertRef}
            tabIndex={-1}
            className={`alert-message ${type}`} 
            role="alert"
            aria-live="assertive"
        >
            {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} /> } {message}
        </div>
    )
}

export default AlertMessage