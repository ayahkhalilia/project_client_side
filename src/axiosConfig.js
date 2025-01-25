import axios from 'axios';

const API = axios.create({
  baseURL: 'https://rebook-backend-ldmy.onrender.com', // Backend URL
  withCredentials: true, // Include credentials if needed
});

export default API;

