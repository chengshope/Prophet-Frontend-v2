export const formatCurrency = (value, currency = 'USD') => {
  if (!value && value !== 0) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value, decimals = 1) => {
  if (!value && value !== 0) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
};
