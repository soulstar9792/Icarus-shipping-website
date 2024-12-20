// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

export const login = createAsyncThunk('auth/login', async (credentials) => {
  const response = await fetch('https://lcarus-shipping-backend-ce6c088c70be.herokuapp.com/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to login');
  }

  const data = await response.json();
  return data; // Assuming the response contains user details
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null, // Retrieve token from localStorage on app start
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Remove token from localStorage on logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const decodedToken = jwtDecode(action.payload.token); // Decode the token        
        state.user = decodedToken; // Save user info from decoded token
        console.log(state.user);
        state.token = action.payload.token; // Assuming token is returned in payload
        state.user = action.payload.user; // Assuming user info is returned in payload
        state.token = action.payload.token; // Assuming token is returned in payload
        console.log(state.token);

        localStorage.setItem('token', action.payload.token); // Store token in localStorage
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;