import { useEffect, useRef, useState } from 'react';
import { X, CircleCheck, CircleX, TriangleAlert, Info } from 'lucide-react';
import './NotificationContainer.css';

const NotificationItem = ({ notification, onRemove, position }) => {
    const {
        id,
        type,
        message,
        duration,
        autoClose,
        theme,
        actions = [],
        count = 1
    } = notification;

    const [isPaused, setIsPaused] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [remainingTime, setRemainingTime] = useState(duration);
    const progressRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const animationFrameRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        notificationRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleWindowBlur = () => {
            setIsPaused(true);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    
        const handleWindowFocus = () => {
            setIsPaused(false);

            startTimeRef.current = Date.now() - (duration - remainingTime);
            if (autoClose) {
                animationFrameRef.current = requestAnimationFrame(updateProgress);
            }
        };
    
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('focus', handleWindowFocus);
    
        return () => {
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('focus', handleWindowFocus);
        };
    }, [autoClose, duration, remainingTime]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CircleCheck size={20} />;
            case 'error':
                return <CircleX size={20} />;
            case 'warning':
                return <TriangleAlert size={20} />;
            default:
                return <Info size={20} />;
        }
    };

    const getAnimationClasses = () => {
        const base = 'notification-item';
        const themeClass = `theme-${theme}`;
        const typeClass = type;

        if (isExiting) {
            switch (position) {
                case 'top-left':
                case 'bottom-left':
                return `${base} ${typeClass} ${themeClass} exiting slide-out-left`;
                case 'top-right':
                case 'bottom-right':
                return `${base} ${typeClass} ${themeClass} exiting slide-out-right`;
                case 'top-center':
                return `${base} ${typeClass} ${themeClass} exiting slide-out-up`;
                case 'bottom-center':
                return `${base} ${typeClass} ${themeClass} exiting slide-out-down`;
                default:
                return `${base} ${typeClass} ${themeClass} exiting slide-out-right`;
            }
        } else {
            switch (position) {
                case 'top-left':
                case 'bottom-left':
                    return `${base} ${typeClass} ${themeClass} slide-in-left`;
                case 'top-right':
                case 'bottom-right':
                    return `${base} ${typeClass} ${themeClass} slide-in-right`;
                case 'top-center':
                    return `${base} ${typeClass} ${themeClass} slide-in-down`;
                case 'bottom-center':
                    return `${base} ${typeClass} ${themeClass} slide-in-up`;
                default:
                    return `${base} ${typeClass} ${themeClass} slide-in-right`;
            }
        }
    }

    const getActionButtonClass = (variant = 'secondary') => {
        const baseClass = 'notification-action-btn';
        const variantClass = `${baseClass}-${variant}`;
        const typeClass = `${baseClass}-${type}`;
        return `${baseClass} ${variantClass} ${typeClass}`;
    };

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onRemove(id);
        }, 300);
    };

    const updateProgress = () => {
        if (!progressRef.current || isPaused) return;
    
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, duration - elapsed);
        setRemainingTime(remaining);
    
        if (remaining > 0) {
            animationFrameRef.current = requestAnimationFrame(updateProgress);
        } else {
            handleClose();
        }
    };

    useEffect(() => {
        if (autoClose && !isPaused && actions.length === 0) {
            animationFrameRef.current = requestAnimationFrame(updateProgress);
        }
    
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [autoClose, isPaused, actions]);

    const handleMouseEnter = () => {
        setIsPaused(true);
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
        startTimeRef.current = Date.now() - (duration - remainingTime);
        if (autoClose && actions.length === 0) {
            animationFrameRef.current = requestAnimationFrame(updateProgress);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') handleClose();
        if (e.key === 'Enter' || e.key === ' ') {
            handleMouseEnter(); 
            if (actions.length === 0) handleClose();
        }
    };

    return(
        <div
        ref={notificationRef}
        className={getAnimationClasses()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="alert"
        aria-describedby={`notification-${id}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        >
            <div className="notification-content">
                <div className="notification-icon">
                    {getIcon()}
                </div>
                <p id={`notification-${id}`} className="notification-message">{message} </p>
                {count > 1 && (
                    <span
                    key={count} 
                    className="notification-count"
                    aria-label={`${count} occurrences`}
                    >
                        x{count}
                    </span>
                )}
                <button
                className="notification-close"
                onClick={handleClose}
                aria-label="Close notification"
                >
                    <X size={18} />
                </button>
            </div>
            {actions.length > 0 && (
                <div className="notification-actions">
                    {actions.map((action, index) => (
                        <button
                        key={index}
                        className={getActionButtonClass(action.variant)}
                        onClick={() => {
                            action.onClick?.();
                            if (action.closeOnClick !== false) {
                                handleClose();
                            }
                        }}
                        disabled={action.disabled}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
            {autoClose && actions.length === 0 && (
                <div
                ref={progressRef}
                className="notification-progress"
                style={{
                    transform: `scaleX(${remainingTime / duration})`,
                    transition: isPaused ? 'none' : 'transform 0.1s linear'
                }}
                />
            )}
        </div>
    )
}

export default NotificationItem;