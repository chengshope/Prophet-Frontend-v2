import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import counterSlice from './slices/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    auth: authSlice,
  },
});

export default store;
