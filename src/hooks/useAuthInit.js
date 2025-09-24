'use client';
import { useEffect } from 'react';
import { useAuthRedux } from './redux';

/**
 * Custom hook to handle authentication initialization
 * Ensures auth state is synchronized with localStorage on app load
 */
export const useAuthInit = () => {
  const { checkAuth, isAuthenticated, loading } = useAuthRedux();

  useEffect(() => {
    // Check authentication status when component mounts
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      // Only check auth if we have data in localStorage
      if (token && userData) {
        await checkAuth();
      }
    };

    initializeAuth();
  }, [checkAuth]);

  return { isAuthenticated, loading };
};