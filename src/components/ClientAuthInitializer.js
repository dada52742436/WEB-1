'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeFromStorage } from '@/lib/slices/authSlice';

/**
 * Component to initialize authentication state on client side
 * This ensures localStorage is only accessed in the browser
 */
export default function ClientAuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage on client side
    dispatch(initializeFromStorage());
  }, [dispatch]);

  return null; // This component doesn't render anything
}