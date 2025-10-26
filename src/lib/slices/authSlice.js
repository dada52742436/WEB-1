import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Simple initial state - localStorage access will be handled in extraReducers
 * This avoids server-side localStorage access errors
 */
const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

/**
 * Async thunk for user login
 * Handles API call and error handling for login process
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Login failed');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);


/**
 * Async thunk for user registration
 * Handles API call and error handling for registration process
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Registration failed');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// 添加到现有的 authSlice.js 文件中

/**
 * Async thunk for user logout
 */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      if (token) {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          return rejectWithValue(data.error || "Logout failed");
        }
      }

      return {};
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);


/**
 * Async thunk for checking authentication status
 * Verifies if user token is still valid
 */
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      // Only access localStorage on client side
      if (typeof window === 'undefined') {
        return rejectWithValue('Cannot check auth on server');
      }

      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        return rejectWithValue('No authentication data found');
      }

      // Verify token with backend
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token validation failed');
      }

      const data = await response.json();
      return { user: data.user, token };
      
    } catch (error) {
      // Clear invalid authentication data (client side only)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return rejectWithValue(error.message || 'Auth check failed');
    }
  }
);

/**
 * Auth slice containing authentication state and reducers
 * Manages user authentication state across the application
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Logout action - clears user data and authentication state
     */
    logout: (state) => {
      state.user = null; 
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Only clear localStorage on client side
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    setError: (state, action) => {
      state.error = action.payload; // payload 自定义错误信息
    },
    /**
     * Clear error action - removes any authentication errors
     */
    clearError: (state) => {
      state.error = null;
    },
    /**
     * Set loading action - manually set loading state
     */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    /**
     * Initialize auth state from localStorage (client side only)
     */
    initializeFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        try {
          const token = localStorage.getItem('token');
          const userData = localStorage.getItem('user');
          
          if (token && userData) {
            state.user = JSON.parse(userData);
            state.token = token;
            state.isAuthenticated = true;
          }
        } catch (error) {
          console.error('Error initializing from localStorage:', error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        // Save to localStorage (client side only)
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        // Save to localStorage (client side only)
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Auth status check cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      // Logout cases
// 在 extraReducers 中添加
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;

        // 清除 localStorage - 使用一致的key
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        // 即使登出失败，也清除本地状态
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      })
  },
});

export const { logout, clearError, setLoading, initializeFromStorage,setError } = authSlice.actions;
export default authSlice.reducer;