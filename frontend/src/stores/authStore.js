import { create } from 'zustand';
import { authService } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isAuthChecked: false,

  checkAuth: async () => {
    console.log('Starting auth check...');
    set({ isAuthChecked: false });
    try {
      const token = localStorage.getItem('token');
      console.log('Token found in localStorage for checkAuth:', token ? 'Yes' : 'No');
      if (!token) {
        set({ isAuthenticated: false, user: null, isAuthChecked: true });
        console.log('No token, setting isAuthenticated to false.');
        return;
      }

      const response = await authService.getProfile();
      console.log('getProfile response:', response);
      if (response.success) {
        set({ isAuthenticated: true, user: response.user, isAuthChecked: true });
        console.log('Auth successful, user set.');
      } else {
        set({ isAuthenticated: false, user: null, isAuthChecked: true });
        localStorage.removeItem('token');
        console.log('getProfile unsuccessful, setting isAuthenticated to false and removing token.');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({ isAuthenticated: false, user: null, isAuthChecked: true });
      localStorage.removeItem('token');
      console.log('Auth check failed, setting isAuthenticated to false and removing token.');
    }
  },

  signin: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signin(email, password);
      console.log('Signin response:', response);
      
      if (response.success && response.token) {
        console.log('Token received from server:', response.token.substring(0, 10) + '...');
        localStorage.setItem('token', response.token);
        console.log('Token stored in localStorage:', response.token.substring(0, 10) + '...');
        
        const storedToken = localStorage.getItem('token');
        console.log('Verified stored token:', storedToken ? storedToken.substring(0, 10) + '...' : 'No token found');
        
        if (storedToken) {
          set({ isAuthenticated: true, user: response.user });
          return { success: true };
        } else {
          console.error('Failed to store token in localStorage');
          return { success: false, error: 'Failed to store authentication token' };
        }
      } else {
        console.error('Invalid signin response:', response);
        return { success: false, error: response.error || 'Invalid response from server' };
      }
    } catch (error) {
      console.error('Signin error:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signup(userData);
      if (response.success) {
        set({ isAuthenticated: true, user: response.user });
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false, error: null });
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.updateProfile(profileData);
      console.log('Response from authService.updateProfile:', response);
      if (response.success) {
        set({ 
          user: response.user,
          isLoading: false,
          error: null 
        });
        return { success: true };
      } else {
        set({ 
          error: response.message || 'Profile update failed', 
          isLoading: false 
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during profile update';
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      return { success: false, message: errorMessage };
    }
  },

  updatePassword: async (passwordData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.updatePassword(passwordData);
      if (response.success) {
        set({ isLoading: false, error: null });
        return { success: true };
      } else {
        set({ 
          error: response.message || 'Password update failed', 
          isLoading: false 
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Password update error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during password update';
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      return { success: false, message: errorMessage };
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        set({ isLoading: false, error: null });
        return { success: true };
      } else {
        set({ 
          error: response.message || 'Password reset request failed', 
          isLoading: false 
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during password reset request';
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      return { success: false, message: errorMessage };
    }
  }
}));

export default useAuthStore; 