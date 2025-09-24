import { authApi } from '@/api/authApi';
import { createSlice } from '@reduxjs/toolkit';

import { clearAuth, getAuthToken, getAuthUser, saveAuth } from '@/utils/authStorage';

const initialState = {
  token: getAuthToken(),
  user: getAuthUser(),
};

const authSlice = createSlice({
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
  },
});

export const removeApiToken = () => (dispatch) => {
  dispatch(clearToken());
};

export const { clearToken } = authSlice.actions;
export default authSlice.reducer;
