import axios from 'axios';
import AuthService from '@/auth.service';
import alert from '@/app/components/SweetAlerts'

const axiosInstance = axios.create({
    baseURL: "https://fms3.bricks4kidznow.com",
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Attach token or any headers you need
        const token = AuthService.getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response, // Do nothing on successful responses
    (error) => {
        if (error.response && error.response.status === 403) {
            // Handle permission mismatch logic here.
            alert({message: 'You don\'t have permission for this action.'});
        }

        if (error.response && error.response.status === 401) {
            AuthService.logout();
            alert({message: 'Login session expired, please login in again.'});
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
