import axios from 'axios';

const API = axios.create({
    baseURL: 'https://rebook-backend-ldmy.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000
});

API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

API.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.config.url.includes('photo') || error.config.url.includes('image')) {
        console.error('Image loading error:', error);
    }
    return Promise.reject(error);
});

export default API;