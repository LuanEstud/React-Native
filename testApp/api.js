import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.10.48:3000',
});

export default api;