import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,

  /**
   * Signup action
   */
  signup: async (email, username, password, firstName = '', lastName = '') => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signup({
        email,
        username,
        password,
        firstName,
        lastName,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.message || 'Signup failed',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Login action
   */
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Get profile action
   */
  getProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.getProfile();
      set({
        user: response.data,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.message || 'Failed to fetch profile',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Logout action
   */
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message || 'Logout failed',
        isLoading: false,
      });
    }
  },

  /**
   * Logout from all devices
   */
  logoutAllDevices: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logoutAllDevices();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message || 'Logout all devices failed',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),

  /**
   * Set user
   */
  setUser: (user) => set({ user }),

  /**
   * Hydrate from localStorage (on app load)
   */
  hydrate: () => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    console.log('authStore - hydrate - token:', !!token, 'user:', !!user);
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log('authStore - hydrate - parsed user:', parsedUser);
        set({ 
          isAuthenticated: true,
          user: parsedUser
        });
      } catch (error) {
        console.error('authStore - hydrate - parse error:', error);
        set({ isAuthenticated: !!token });
      }
    } else {
      console.log('authStore - hydrate - no token or user');
      set({ isAuthenticated: !!token, user: null });
    }
  },
}));
