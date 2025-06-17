import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ENV } from '../config/ENV.js'

const NotificationContext = createContext(null);

const initialState = {
    notifications: []
};

const MAX_NOTIFICATIONS = Number(ENV.MAX_NOTIFICATIONS) || 5;

const areNotificationsEqual = (a, b) => {
    if (a.type !== b.type || 
        a.message !== b.message || 
        a.position !== b.position || 
        a.theme !== b.theme ||
        a.actions?.length !== b.actions?.length) {
        return false;
    }

    if (a.actions?.length > 0) {
        return a.actions.every((action, index) => {
            const bAction = b.actions[index];
            return action.label === bAction.label &&
                    action.variant === bAction.variant &&
                    action.disabled === bAction.disabled;
        });
    }

    return true;
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_NOTIFICATION': {
            const existingNotificationIndex = state.notifications.findIndex(
                notification => areNotificationsEqual(notification, action.payload)
            );

            if (existingNotificationIndex !== -1) {
                const updatedNotifications = [...state.notifications];
                const existingNotification = updatedNotifications[existingNotificationIndex];
                
                updatedNotifications[existingNotificationIndex] = {
                ...existingNotification,
                count: (existingNotification.count || 1) + 1,
                createdAt: Date.now() // Reset lifetime
                };

                return {
                    ...state,
                    notifications: updatedNotifications
                };
            }

            let newNotifications = [...state.notifications];

            // Remove oldest notification if limit is reached
            if (newNotifications.length >= MAX_NOTIFICATIONS) {
                const notificationsByPosition = {};
                
                // Group notifications by position
                newNotifications.forEach(notification => {
                    if (!notificationsByPosition[notification.position]) {
                        notificationsByPosition[notification.position] = [];
                    }
                    notificationsByPosition[notification.position].push(notification);
                });

                // Find the oldest notification in the same position
                const position = action.payload.position;
                const positionNotifications = notificationsByPosition[position] || [];
                
                if (positionNotifications.length > 0) {
                    // Remove the oldest notification in this position
                    const oldestNotification = positionNotifications.reduce((oldest, current) => 
                        current.createdAt < oldest.createdAt ? current : oldest
                    );
                    newNotifications = newNotifications.filter(n => n.id !== oldestNotification.id);
                } else {
                    // If no notifications in the same position, remove the oldest overall
                    const oldestNotification = newNotifications.reduce((oldest, current) => 
                        current.createdAt < oldest.createdAt ? current : oldest
                    );
                    newNotifications = newNotifications.filter(n => n.id !== oldestNotification.id);
                }
            }

            return {
                ...state,
                notifications: [...newNotifications, { ...action.payload, count: 1 }]
            };
        }
        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter(
                notification => notification.id !== action.payload
                )
            };
        case 'CLEAR_ALL':
            return {
                ...state,
                notifications: []
            };
        default:
        return state;
    }
};

// Audio Manager Class
class AudioManager {
    constructor(soundConfig = {}) {
        this.soundConfig = {
        volume: 0.5,
        allowOverlap: false,
        ...soundConfig
        };
        this.audioQueue = [];
        this.isPlaying = false;
        this.audioCache = new Map();
        this.isAudioEnabled = true;
        
        this.checkAudioSupport();
    }

    checkAudioSupport() {
        try {
            const audio = new Audio();
            this.isAudioEnabled = !!audio.canPlayType;
        } catch (error) {
            console.warn('Audio not supported:', error);
            this.isAudioEnabled = false;
        }
    }

    async preloadAudio(type, src) {
        if (!this.isAudioEnabled || !src) return;

        try {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.volume = this.soundConfig.volume;
            
            return new Promise((resolve, reject) => {
                audio.addEventListener('canplaythrough', () => {
                this.audioCache.set(type, audio);
                resolve(audio);
                });
                
                audio.addEventListener('error', (e) => {
                console.warn(`Failed to load audio for ${type}:`, e);
                reject(e);
                });
                
                audio.src = src;
            });
        } catch (error) {
            console.warn(`Error preloading audio for ${type}:`, error);
        }
    }

    async playSound(type) {
        if (!this.isAudioEnabled || !this.soundConfig[type]) return;

        try {
            // Check if audio is already playing and overlap is not allowed
            if (!this.soundConfig.allowOverlap && this.isPlaying) {
                this.audioQueue.push(type);
                return;
            }

            let audio = this.audioCache.get(type);
            
            if (!audio) {
                // Try to create and play audio immediately if not cached
                audio = new Audio(this.soundConfig[type]);
                audio.volume = this.soundConfig.volume;
            }

            // Clone audio for overlapping sounds if allowed
            if (this.soundConfig.allowOverlap) {
                audio = audio.cloneNode();
                audio.volume = this.soundConfig.volume;
            }

            this.isPlaying = true;
            
            audio.addEventListener('ended', () => {
                this.isPlaying = false;
                this.playNextInQueue();
            });

            audio.addEventListener('error', (e) => {
                console.warn(`Error playing sound for ${type}:`, e);
                this.isPlaying = false;
                this.playNextInQueue();
            });

            await audio.play();
        } catch (error) {
            console.warn(`Failed to play sound for ${type}:`, error);
            this.isPlaying = false;
            this.playNextInQueue();
        }
    }

    playNextInQueue() {
        if (this.audioQueue.length > 0) {
            const nextType = this.audioQueue.shift();
            this.playSound(nextType);
        }
    }

    updateConfig(newConfig) {
        this.soundConfig = { ...this.soundConfig, ...newConfig };
        
        // Update volume for cached audio
        this.audioCache.forEach(audio => {
            audio.volume = this.soundConfig.volume;
        });
    }

    cleanup() {
        this.audioQueue = [];
        this.audioCache.forEach(audio => {
        audio.pause();
        audio.src = '';
        });
        this.audioCache.clear();
    }
}

export const NotificationProvider = ({ children, soundConfig }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const audioManagerRef = useRef(null);

    useEffect(() => {
        if (soundConfig) {
            audioManagerRef.current = new AudioManager(soundConfig);
            
            // Preload audio files
            Object.entries(soundConfig).forEach(([type, src]) => {
            if (typeof src === 'string' && ['success', 'error', 'warning', 'info'].includes(type)) {
                audioManagerRef.current.preloadAudio(type, src);
            }
            });
        }

        return () => {
            if (audioManagerRef.current) {
                audioManagerRef.current.cleanup();
            }
        };
    }, [soundConfig]);

    const showNotification = useCallback(({
        type = 'info',
        message,
        duration = 5000,
        autoClose = true,
        theme = 'light',
        position = 'top-right',
        actions = [],
        playSound = ENV.NOTIFICATIONS_SOUND === 'true'
    }) => {
        const id = uuidv4();
        const notification = {
            id,
            type,
            message,
            duration,
            autoClose,
            theme,
            position,
            actions,
            createdAt: Date.now()
        };

        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

        // Play sound if enabled
        if (playSound && audioManagerRef.current) {
            audioManagerRef.current.playSound(type);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, []);

    const clearAll = useCallback(() => {
        dispatch({ type: 'CLEAR_ALL' });
    }, []);

    const updateSoundConfig = useCallback((newConfig) => {
        if (audioManagerRef.current) {
            audioManagerRef.current.updateConfig(newConfig);
        }
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications: state.notifications,
                showNotification,
                removeNotification,
                clearAll,
                updateSoundConfig
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context.showNotification;
};

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
};