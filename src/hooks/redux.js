import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { loginUser, registerUser, checkAuthStatus, logout, clearError ,setError} from '@/lib/slices/authSlice';

/**
 * Custom hook for accessing auth state from Redux store
 * @returns {Object} Auth state containing user, loading, error, and isAuthenticated
 */
export const useAuth = () => {
  return useSelector((state) => state.auth);
};

/**
 * Custom hook for auth actions
 * @returns {Object} Auth action methods
 */
export const useAuthActions = () => {
  const dispatch = useDispatch();

  const login = useCallback((credentials) => {
    return dispatch(loginUser(credentials));
  }, [dispatch]);

  const register = useCallback((userData) => {
    return dispatch(registerUser(userData));
  }, [dispatch]);

  const checkAuth = useCallback(() => {
    return dispatch(checkAuthStatus());
  }, [dispatch]);

  const userLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setErrorMessage = useCallback((message) => {
    dispatch(setError(message));
  }, [dispatch]);

  return {
    login,
    register,
    checkAuth,
    logout: userLogout,
    clearError: clearAuthError,
    setError: setErrorMessage,
  };
};

/**
 * Custom hook combining auth state and actions
 * @returns {Object} Combined auth state and actions
 */
export const useAuthRedux = () => {
  const auth = useAuth();
  const actions = useAuthActions();

  return {
    ...auth,
    ...actions,
  };
};