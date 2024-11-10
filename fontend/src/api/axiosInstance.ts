// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
