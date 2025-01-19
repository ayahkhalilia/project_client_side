import axios from 'axios';

// Base URL of your backend
const API = axios.create({
    baseURL: 'https://rebook-backend-ldmy.onrender.com', // Replace with your actual backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default API;
