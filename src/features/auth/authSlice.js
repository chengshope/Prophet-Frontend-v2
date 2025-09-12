import { authApi } from '@/api';
import { createSlice } from '@reduxjs/toolkit';

import { clearAuth, getAuthToken, getAuthUser, saveAuth } from '@/utils/authStorage';

const initialState = {
  token: getAuthToken(),
  user: getAuthUser(),
};

const tokenSlice = createSlice({
  name: 'apiToken',
  initialState,
  reducers: {
    clearToken(state) {
      state.token = null;
      state.user = null;
      clearAuth();
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      const remember = !!action?.meta?.arg?.originalArgs?.remember;
      saveAuth(action.payload.accessToken, action.payload.user, remember);
    });

    builder.addMatcher(authApi.endpoints.login.matchRejected, (_, action) => {
      console.error('Login failed:', action.error);
    });
  },
});

export const removeApiToken = () => (dispatch) => {
  dispatch(clearToken());
};

export const { clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
