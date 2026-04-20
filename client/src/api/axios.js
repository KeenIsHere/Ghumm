import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5742/api/',
  withCredentials: true,
});

export default API;
