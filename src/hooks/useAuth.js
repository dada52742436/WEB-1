'use client';
import { useState, useEffect } from 'react';

/**
 * Custom hook for authentication state management
 * Fixes the issue where isAuthenticated wasn't updating correctly
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('Checking auth status - Token exists:', !!token, 'User data exists:', !!userData);
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('User authenticated:', parsedUser.username);
      } else {
        console.log('No authentication data found');
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    try {
      console.log('Logging in user:', userData.username);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData); // This should immediately update the state
      console.log('Login successful, user state updated');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null); // This should immediately update the state
  };

  // Return the authentication state and methods
  return { 
    user, 
    loading, 
    login, 
    logout,
    isAuthenticated: !!user // This will be true when user exists
  };
};