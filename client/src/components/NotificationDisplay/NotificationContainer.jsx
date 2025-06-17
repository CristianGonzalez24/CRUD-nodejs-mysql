import { useEffect, useRef } from 'react';
import { useNotificationContext } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';
import './NotificationContainer.css'

const NotificationContainer = ({ theme = 'light', withSound = false, soundConfig = {} }) => {
    const { notifications, removeNotification } = useNotificationContext();
    // const { theme } = useTheme(); // Get the theme from the context and delete theme prop     

    useEffect(() => { 
        // Handle browser audio permissions
        const handleUserInteraction = () => {
            if (withSound) {
                // This helps with browsers that require user interaction before playing audio
                const audio = new Audio();
                audio.volume = 0;
                audio.play().catch(() => {
                    // Silently fail - this is just to unlock audio context
                });
            }
        };
    
        document.addEventListener('click', handleUserInteraction, { once: true });
        document.addEventListener('keydown', handleUserInteraction, { once: true });
    
        return () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };
    }, [withSound]);

    const normalizePosition = (pos) => pos.replace(/([A-Z])/g, '-$1').toLowerCase();

    const groupedByPosition = notifications.reduce((acc, notification) => {
        const rawPos = notification.position || 'top-right';
        const pos = normalizePosition(rawPos);
        if (!acc[pos]) acc[pos] = [];
        acc[pos].push(notification);
        return acc;
    }, {});

    return (
        <>
            {Object.entries(groupedByPosition).map(([position, notifications]) => (
                <div key={position} className={`notification-container ${position} theme-${theme}`} role="alert" aria-live="polite" data-with-sound={withSound}>
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onRemove={removeNotification}
                            position={position}
                        />
                    ))}
                </div>
            ))}
        </>
    )
};

export default NotificationContainer;