export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:5000/api',
  
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    UPDATE_PROFILE: '/auth/update-profile',
    REFRESH_TOKEN: '/auth/refresh-token'
  },

  PORTFOLIO: {
    GET: '/portfolio',
    UPDATE: '/portfolio'
  },

  PROJECTS: {
    GET_ALL: '/projects',
    GET_ONE: '/projects',
    CREATE: '/projects',
    UPDATE: '/projects',
    DELETE: '/projects'
  }
}; 