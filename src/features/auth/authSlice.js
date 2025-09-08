import { createSlice } from '@reduxjs/toolkit';

const TOKEN_KEY = 'PROPHET-X-API-TOKEN';

const initialState = {
  token: typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,
};

export const tokenSlice = createSlice({
  name: 'apiToken',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, action.payload);
      }
    },
    clearToken(state) {
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
      }
    },
  },
});

export const { setToken, clearToken } = tokenSlice.actions;

// Helper thunks for usage in components
export const saveApiToken = (token) => (dispatch) => {
  dispatch(setToken(token));
};

export const removeApiToken = () => (dispatch) => {
  dispatch(clearToken());
};

export default tokenSlice.reducer;
