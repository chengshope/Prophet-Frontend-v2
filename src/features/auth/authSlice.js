import { authApi } from '@/api';
import { createSlice } from '@reduxjs/toolkit';

const TOKEN_KEY = 'PROPHET-TOKEN';
const USER_KEY = 'PROPHET-USER';

const isBrowser = typeof window !== 'undefined';
const saveToStorage = (token, user) => {
  if (isBrowser) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};
const removeFromStorage = () => {
  if (isBrowser) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

const initialState = {
  token: isBrowser ? localStorage.getItem(TOKEN_KEY) : null,
  user: isBrowser ? JSON.parse(localStorage.getItem(USER_KEY)) : null,
};

const tokenSlice = createSlice({
  name: 'apiToken',
  initialState,
  reducers: {
    clearToken(state) {
      state.token = null;
      state.user = null;
      removeFromStorage();
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      saveToStorage(action.payload.accessToken, action.payload.user);
      console.log('Login success:', action.payload);
    });

    builder.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
      console.error('Login failed:', action.error);
    });
  },
});

export const removeApiToken = () => (dispatch) => {
  dispatch(clearToken());
};

export const { clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
