'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthRedux } from '@/hooks/redux';
import { useAuthInit } from '@/hooks/useAuthInit';

/**
 * Register page component
 * Handles user registration using Redux for state management
 * Uses async thunks for API calls and error handling
 */
export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const router = useRouter();
  const { 
    isAuthenticated, 
    loading, 
    error, 
    register, 
    clearError,
    setError
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
   * Validates form data before submission
   * @returns {boolean} True if validation passes, false otherwise
   */
  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required'); 
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('password entered should be the same'); 
      return false;
    }

    if (formData.password.length < 8) {
      setError('password length should be greater or equal 8'); 
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email form validation failed, please enter again'); 
      return false;
    }

    return true;
  };

  /**
   * Handles form submission
   * Dispatches register action using Redux async thunk
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      /*
      createAsyncThunk 的异步action一共有3个状态，pending, rejected fulfilled
      */ 
      
      if (result.type.endsWith('fulfilled')) {//异步action 状态检查 也等于 (result.type === 'auth/register/fulfilled')
      
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      }
    } catch (error) {
      // Error is already handled by Redux
      console.error('Registration error:', error);
    }
  };

  if (initLoading || initAuthenticated) {
    return null;
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Register</h1>
      
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
            // required
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

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            // required
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

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            // required
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
            Confirm Password:
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            // required
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
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: '#0070f3', textDecoration: 'none' }}>
          Login here
        </Link>
      </p>
    </div>
  );
}