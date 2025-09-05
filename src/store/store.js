import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './slices/counterSlice'
import authSlice from './slices/authSlice'

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    auth: authSlice,
  },
})

export default store
