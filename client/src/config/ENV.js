export const ENV = {
    API_URL: import.meta.env.VITE_API_URL,
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL,
    GOOGLE_REDIRECT_URI: import.meta.env.VITE_OAUTH_GOOGLE_REDIRECT_URI,
    IS_DEV: import.meta.env.DEV,
    MAX_NOTIFICATIONS: import.meta.env.VITE_MAX_NOTIFICATIONS,
    NOTIFICATIONS_SOUND: import.meta.env.VITE_NOTIFICATIONS_SOUND,
    IMAGE_MAX_SIZE: import.meta.env.VITE_IMAGE_MAXSIZE
};