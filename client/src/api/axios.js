import axios from 'axios';

// Use environment variable for API URL, with fallback for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5742';

const API = axios.create({
  baseURL: `${API_BASE_URL}/api/`,
  withCredentials: true,
});

export default API;
