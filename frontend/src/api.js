import axios from 'axios';

// Create a base instance of axios
const API = axios.create({
    baseURL: 'http://localhost:5001/api', 
});

// Before ANY request leaves the frontend, this function runs.
API.interceptors.request.use((req) => {
    // Check if the user is logged in by looking for a token in LocalStorage
    const token = localStorage.getItem('token');
    
    // If a token exists, attach it to the headers 
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    
    return req;
});

export default API;