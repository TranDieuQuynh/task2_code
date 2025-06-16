import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Request interceptor - Token:', token ? 'Token exists' : 'No token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Request headers:', {
        Authorization: 'Bearer ' + token.substring(0, 10) + '...',
        'Content-Type': config.headers['Content-Type']
      });
    }
    // Preserve Content-Type if it's set
    if (config.headers['Content-Type']) {
      config.headers['Content-Type'] = config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Hàm kiểm tra JWT token
export const checkJWTValidity = () => {
  console.log('Checking JWT validity...');
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token ? 'exists' : 'not found');
  
  if (!token) {
    console.log('No token found');
    return false;
  }

  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    console.log('JWT Status:', {
      isValid: tokenData.exp > currentTime,
      expiresAt: new Date(tokenData.exp * 1000).toLocaleString(),
      currentTime: new Date(currentTime * 1000).toLocaleString(),
      duration: Math.floor((tokenData.exp - currentTime) / 60) + ' minutes remaining',
      tokenData: tokenData
    });

    const isValid = tokenData.exp > currentTime;
    if (!isValid) {
      console.log('Token is expired');
    }
    return isValid;
  } catch (err) {
    console.error('Invalid JWT format:', err);
    return false;
  }
};

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log('API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      data: error.response?.data,
      headers: error.config?.headers
    });

    if (error.response?.status === 401) {
      console.log('Received 401 error for URL:', error.config.url);
      const isAuthRoute = error.config.url.includes('/auth/signin') || 
                         error.config.url.includes('/auth/signup') ||
                         error.config.url.includes('/auth/forgot-password');
      
      console.log('Is auth route:', isAuthRoute);
      
      if (!isAuthRoute) {
        const isTokenValid = checkJWTValidity();
        console.log('Token validation result:', isTokenValid);
        if (!isTokenValid) {
          console.log('Token is invalid or expired');
          localStorage.removeItem('token');
        }
      }
    } else if (error.response?.status === 404) {
      console.error('Resource not found:', error.config.url);
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    } else if (!error.response) {
      console.error('Network error or request cancelled:', error.message);
    }

    return Promise.reject(error);
  }
);

// Auth Service
const authService = {
  signin: async (credentials) => {
    try {
      console.log('Sending signin request with credentials:', credentials);
      const response = await api.post('/auth/signin', credentials);
      console.log('Signin response:', response);
      return response;
    } catch (error) {
      console.error('Signin API error:', error.response?.data || error.message);
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      console.log('Sending profile update request with data:', profileData);
      const response = await api.put('/auth/profile', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Profile update response:', response);
      return response;
    } catch (error) {
      console.error('Profile update API error:', error.response?.data || error.message);
      throw error;
    }
  },

  updatePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/password', passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Portfolio service
export const portfolioService = {
  get: async () => {
    const response = await api.get('/portfolio');
    return response;
  },

  update: async (formData) => {
    const response = await api.put('/portfolio', formData);
    return response;
  }
};

// Projects Service
export const projectsService = {
  getAll: async () => {
    try {
      const response = await api.get('/projects');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  create: async (formData) => {
    try {
      const response = await api.post('/projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, formData) => {
    try {
      const response = await api.put(`/projects/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export { authService };
export default api; 