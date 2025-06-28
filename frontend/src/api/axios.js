import axios from 'axios';

// Create a new Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// IMPORTANT: Request interceptor to add the auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401 Unauthorized errors globally
api.interceptors.response.use(
  (response) => response, // Simply return the response if it's successful
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401) {
      alert('Your session is invalid or has expired. Please log in again.');
      
      // Clear the invalid token from storage
      localStorage.removeItem('token');
      
      // Redirect to the login page.
      // Using window.location.href will force a full page reload, clearing any old state.
      window.location.href = '/login';
    }
    
    // For all other errors, just pass them along
    return Promise.reject(error);
  }
);

export default api; 