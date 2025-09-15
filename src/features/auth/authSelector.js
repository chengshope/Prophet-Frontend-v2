export const selectAuth = (state) => state.auth;

export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;

// Username: prefer full name (first + last), then explicit username, then generic name fields
export const selectUsername = (state) => {
  const u = state.auth.user;
  if (!u) return undefined;
  const first = typeof u.first_name === 'string' ? u.first_name.trim() : '';
  const last = typeof u.last_name === 'string' ? u.last_name.trim() : '';
  const full = [first, last].filter(Boolean).join(' ');
  return full || u.username || u.name || u?.user?.name || u?.user?.username || undefined;
};

// Portfolio name: prefer v2 user.pf.portfolio_name, then common fallbacks
export const selectPortfolioName = (state) => {
  const u = state.auth.user;
  if (!u) return undefined;
  return u?.pf?.portfolio_name || undefined;
};

export const selectPortfolioId = (state) => {
  const user = state?.auth?.user;
  if (!user) return undefined;
  // Try pf.id first (preferred), then fallback to portfolio_id
  return user.pf?.id || user.portfolio_id || undefined;
};

export const selectIsAuthenticated = (state) => Boolean(state.auth.token);
