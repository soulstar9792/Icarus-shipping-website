import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, // Include authReducer in the store
  },
});

export default store;