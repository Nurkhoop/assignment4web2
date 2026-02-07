import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login as loginApi, register as registerApi } from '../services/api';
import type { AuthState, User } from '../types';

const tokenFromStorage = localStorage.getItem('token');
const userFromStorage = localStorage.getItem('user');
let parsedUser = null;

if (userFromStorage) {
  try {
    parsedUser = JSON.parse(userFromStorage);
  } catch {
    parsedUser = null;
  }
}

const initialState: AuthState = {
  isAuthenticated: Boolean(tokenFromStorage),
  user: parsedUser,
  token: tokenFromStorage,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await loginApi(credentials);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      if (message.toLowerCase().includes('password not set')) {
        return rejectWithValue('This account is missing a password. Please register again.');
      }
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await registerApi(payload);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setUser } = authSlice.actions;

export default authSlice.reducer;
