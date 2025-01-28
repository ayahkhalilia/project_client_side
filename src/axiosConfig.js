import axios from 'axios';

const API = axios.create({
    baseURL: 'https://rebook-backend-ldmy.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default API;
