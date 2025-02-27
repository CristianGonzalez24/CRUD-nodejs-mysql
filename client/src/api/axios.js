import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

const handleError = (error) => {
    if (error.response) {
        const errorMessage = error.response.data.message || error.response.statusText;
        console.error(`Error ${error.response.status}: ${errorMessage}`);
        toast.error(`Error ${error.response.status}: ${errorMessage}`);
    } else if (error.request) {
        console.error('Could not connect to the server. Please check your internet connection.');
        toast.error('Could not connect to the server. Please check your internet connection.', { hideProgressBar: true,});
    } else {
        console.error('Error:', error.message);
        toast.error(`Error: ${error.message}`);
    }

    return Promise.reject(error);
};

instance.interceptors.response.use(
    response => response,
    error => handleError(error)
);

export default instance;