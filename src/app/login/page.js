'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthRedux } from '@/hooks/redux';
import { useAuthInit } from '@/hooks/useAuthInit';

/**
 * Login page component
 * Handles user authentication using Redux for state management
 * Uses async thunks for API calls and error handling
 */
export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const router = useRouter();
  const { 
    isAuthenticated, 
    loading, 
    error, 
    login, 
    clearError 
  } = useAuthRedux();

  // Initialize auth state
  const { isAuthenticated: initAuthenticated, loading: initLoading } = useAuthInit();

  // Redirect if already authenticated
  useEffect(() => {
    if (!initLoading && initAuthenticated) {
      router.push('/dashboard');
    }
  }, [initAuthenticated, initLoading, router]);

  // Clear error when component unmounts or form changes
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  /**
   * Handles form input changes
   * Updates form state and clears any existing errors
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (error) {
      clearError();
    }
  };

  /**
   * Handles form submission
   * Dispatches login action using Redux async thunk
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      return;
    }

    try {
      const result = await login(formData);
      
      if (result.type.endsWith('fulfilled')) {
        router.push('/dashboard');
      }
    } catch (error) {
      // Error is already handled by Redux
      console.error('Login error:', error);
    }
  };

  if (initLoading || initAuthenticated) {
    return null;
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h1>
      
      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffebee', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          border: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Username:
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Don't have an account?{' '}
        <Link href="/register" style={{ color: '#0070f3', textDecoration: 'none' }}>
          Register here
        </Link>
      </p>
    </div>
  );
}