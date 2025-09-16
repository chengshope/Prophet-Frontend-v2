import dayjs from 'dayjs';

export const formatCurrency = (value, currency = 'USD') => {
  if (!value && value !== 0) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
};

export const formatRevenue = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00M';
  }
  const numValue = Number(value);
  return `$${(numValue / 1000000).toFixed(2)}M`;
};

export const formatRevPAF = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00';
  }
  const numValue = Number(value);
  return `$${numValue.toFixed(2)}`;
};

export const formatPercent = (value, decimals = 1) => {
  if (!value && value !== 0) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatOccupancy = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  const numValue = Number(value);
  return `${numValue.toFixed(2)}%`;
};

export const formatDate = (date) => {
  if (!date) return '';
  return dayjs(date).format('MMM DD, YYYY');
};

export const getChangeType = (apiData) => {
  if (apiData?.increased === true) return 'positive';
  if (apiData?.increased === false) return 'negative';
  return 'neutral';
};

export const formatChange = (apiData, isPercentage = false) => {
  if (
    apiData?.percentage_change !== null &&
    apiData?.percentage_change !== undefined &&
    !isNaN(apiData.percentage_change)
  ) {
    const numValue = Number(apiData.percentage_change);
    const value = numValue.toFixed(2);
    return isPercentage ? `${value}%` : `${value}% MoM`;
  }
  return isPercentage ? '0.00%' : '0.00% MoM';
};

export const getFormattedDate = (apiData, fallbackDate) => {
  if (apiData?.formatted_date) {
    return apiData.formatted_date;
  }
  if (apiData?.date) {
    return dayjs(apiData.date).format('MMM DD, YYYY');
  }
  return fallbackDate?.format('MMM DD, YYYY') || dayjs().format('MMM DD, YYYY');
};
