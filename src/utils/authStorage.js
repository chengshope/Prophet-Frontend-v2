const TOKEN_KEY = 'PROPHET-TOKEN';
const USER_KEY = 'PROPHET-USER';

const isBrowser = typeof window !== 'undefined';

export const saveAuth = (token, user, remember = true) => {
  if (isBrowser) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearAuth = () => {
  if (isBrowser) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }
};

export const getAuthToken = () => {
  if (isBrowser) {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const getAuthUser = () => {
  if (isBrowser) {
    try {
      return (
        JSON.parse(localStorage.getItem(USER_KEY)) || JSON.parse(sessionStorage.getItem(USER_KEY))
      );
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  return null;
};
