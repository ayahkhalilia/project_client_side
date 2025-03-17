import axios from 'axios';

// Use the deployed server URL instead of localhost
const API = axios.create({
    baseURL: 'https://rebook-backend-ldmy.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
    // Add longer timeout for the render.com server which might be slow to respond
    timeout: 15000
});

// Add request interceptor to include token automatically if available
API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Add response interceptor to log image loading issues
API.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.config.url.includes('photo') || error.config.url.includes('image')) {
        console.error('Image loading error:', error);
    }
    return Promise.reject(error);
});

export default API;