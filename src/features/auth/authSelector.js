export const selectAuth = (state) => state.auth;

export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;

export const selectUsername = (state) => {
  const u = state.auth.user;
  if (!u) return undefined;
  const first = typeof u.first_name === 'string' ? u.first_name.trim() : '';
  const last = typeof u.last_name === 'string' ? u.last_name.trim() : '';
  const full = [first, last].filter(Boolean).join(' ');
  return full || u.username || u.name || u?.user?.name || u?.user?.username || undefined;
};

export const selectPortfolioName = (state) => {
  const u = state.auth.user;
  if (!u) return undefined;
  return u?.pf?.portfolio_name || undefined;
};

export const selectPortfolioId = (state) => {
  const user = state?.auth?.user;
  if (!user) return undefined;
  return user.pf?.id || user.portfolio_id || undefined;
};

export const selectIsAuthenticated = (state) => Boolean(state.auth.token);

export const selectPmsType = (state) => state.auth.user?.pf?.pms_type;

export const selectCustomerId = (state) => {
  const user = state?.auth?.user;
  if (!user) return undefined;
  return user.id || user.customer_id || user?.user?.id || undefined;
};
