import { useEffect, useCallback } from 'react';
import './ConfirmationModal.css'
import { AlertTriangle, X, AlertCircle, CheckCircle } from 'lucide-react';

const ConfirmationModal = ({
    loading,
    isOpen, 
    onClose, 
    closing,
    onConfirm, 
    title, 
    message, 
    type = 'info',
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return <AlertTriangle className="modal-icon danger" size={32} />;
            case 'warning':
                return <AlertCircle className="modal-icon warning" size={32} />;
            case 'success':
                return <CheckCircle className="modal-icon success" size={32} />;
            default:
                return <AlertCircle className="modal-icon info" size={32} />;
        }
    };

    const getButtonClass = () => {
        switch (type) {
            case 'danger':
                return 'btn btn-danger';
            case 'warning':
                return 'btn btn-warning';
            case 'success':
                return 'btn btn-success';
            default:
                return 'btn btn-primary';
        }
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };
    
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    const handleKeyDown = useCallback((e) => {
        if (e.key === "Escape") {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className={`modal-overlay ${closing ? "hidden" : ""}`} onClick={handleOverlayClick}>
            <div className={`modal-content ${closing ? "hidden" : ""}`} role="dialog" aria-modal="true">
                <button 
                    className="modal-close" 
                    onClick={onClose}
                    aria-label="Close modal"
                    disabled={loading}
                >
                    <X size={24} />
                </button>

                <div className="modal-header">
                    {getIcon()}
                    <h2 className="modal-title">{title}</h2>
                </div>

                <p className="modal-message">{message}</p>

                <div className="modal-actions">
                    <button
                        onClick={onClose}
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={getButtonClass()}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal