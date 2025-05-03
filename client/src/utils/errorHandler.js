import { ENV } from '../config/ENV.js';
import { toast } from 'react-toastify';

export const handleError = (error, options = {}) => {
    const {
        fallbackMessage = "An unexpected error occurred.",
        showToast = true,     
        logOnly = false       
    } = options;

    const isDev = ENV.IS_DEV;

    let message = fallbackMessage;
    let status = 500;

    if (error.response) {
        status = error.response.status || 500;
        const backendMessage =
            error.response.data?.error?.message || error.response.data?.message;

        message = backendMessage || error.response.statusText || fallbackMessage;
    } else if (error.request) {
        message = "Could not connect to the server. Please check your internet connection.";
    } else {
        message = error.message || fallbackMessage;
    }

    const formattedError = `${status}: ${message}`;

    if (isDev) {
        console.error(`[ErrorHandler] ${formattedError}`, error);
        if (!logOnly && showToast) {
            toast.error(formattedError);
        }
    }

    if (!isDev && showToast && !logOnly) {
        toast.error(formattedError);
    }

    return formattedError;
};