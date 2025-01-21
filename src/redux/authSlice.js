// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the async thunk for login
export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    return response.data;  // Assuming the API returns a JSON response with a token
  } catch (error) {
    return Promise.reject(error.response.data); // Handle errors in the API
  }
});


export const checkToken = createAsyncThunk('auth/checkToken', async (token) => {
  const response = await axios.get('http://localhost:5000/api/auth/verify', {
    headers: { 'token': token },
  });
  // console.log(response.data);
  return response.data;
});

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    error: null,
    loading: false,
    user: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null; // Reset the token on logout
      state.error = null; // Clear any login error
      localStorage.removeItem('token'); // Clear token from local storage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true; // Set loading when the request is initiated
        state.error = null;   // Clear previous errors
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false; // Stop loading when the request is complete
        state.token = action.payload.token; // Save the token received from the API
        state.user = action.payload.user; // Save the user data received from the API
        localStorage.setItem('token', state.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Login failed'; // Store error message if exists
      });

    builder
      .addCase(checkToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(checkToken.rejected, (state) => {
        state.token = null; // Clear token on error
        state.user = null; // Clear user info
        localStorage.removeItem('token'); // Clear token from local storage
      });

  },
});

// Export the reducer and actions
export const { logout } = authSlice.actions; // Export logout action
export default authSlice.reducer;  // Export the reducer for the store