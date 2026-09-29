import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { getApiError } from '../../api';

const savedToken = localStorage.getItem('blogToken');

export const signup = createAsyncThunk('auth/signup', async (form, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/signup', form);
    localStorage.setItem('blogToken', data.token);
    return data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const login = createAsyncThunk('auth/login', async (form, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', form);
    localStorage.setItem('blogToken', data.token);
    return data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const restoreSession = createAsyncThunk('auth/restore', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data.user;
  } catch (error) {
    localStorage.removeItem('blogToken');
    return rejectWithValue(getApiError(error));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: savedToken, status: savedToken ? 'checking' : 'idle', error: null },
  reducers: {
    logout(state) {
      localStorage.removeItem('blogToken');
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
    clearAuthError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.status = 'loading'; state.error = null; };
    const fulfilled = (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload.user;
      state.token = action.payload.token;
    };
    const rejected = (state, action) => { state.status = 'failed'; state.error = action.payload; };
    builder
      .addCase(signup.pending, pending).addCase(signup.fulfilled, fulfilled).addCase(signup.rejected, rejected)
      .addCase(login.pending, pending).addCase(login.fulfilled, fulfilled).addCase(login.rejected, rejected)
      .addCase(restoreSession.fulfilled, (state, action) => { state.status = 'succeeded'; state.user = action.payload; })
      .addCase(restoreSession.rejected, (state) => { state.status = 'idle'; state.user = null; state.token = null; });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
