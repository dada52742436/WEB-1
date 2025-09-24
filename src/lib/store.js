import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

/**
 * Redux store configuration
 * Uses Redux Toolkit for simplified store setup
 * Includes auth slice for authentication state management
 */
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    // Redux Toolkit includes thunk middleware by default
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types for serializable check
          ignoredActions: ['persist/PERSIST'],
        },
      }),
  });
};