import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
    // baseURL: 'https://crm-7o4h.onrender.com/api',

});

// Utility to set or remove the Authorization header
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
