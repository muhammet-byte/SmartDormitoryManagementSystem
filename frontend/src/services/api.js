import axios from 'axios';

// Spring Boot backend'imizin çalıştığı varsayılan adres ve port
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;