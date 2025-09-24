'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/store';

/**
 * Redux Provider component
 * Wraps the application with Redux store provider
 * Ensures store is created only once with useRef
 */
export default function ReduxProvider({ children }) {
  const storeRef = useRef();
  
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}