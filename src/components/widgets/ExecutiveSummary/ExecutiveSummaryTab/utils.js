import dayjs from 'dayjs';

// Formatter functions for charts
export const formatRevenue = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00M';
  }
  const numValue = Number(value);
  return `$${(numValue / 1000000).toFixed(2)}M`;
};

export const formatOccupancy = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  const numValue = Number(value);
  return `${numValue.toFixed(2)}%`;
};

export const formatRevPAF = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00';
  }
  const numValue = Number(value);
  return `$${numValue.toFixed(2)}`;
};

// Helper function to get change type from API response
export const getChangeType = (apiData) => {
  if (apiData?.increased === true) return 'positive';
  if (apiData?.increased === false) return 'negative';
  return 'neutral';
};

// Helper function to format change value from API response
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

// Helper function to get formatted date from API response
export const getFormattedDate = (apiData, fallbackDate) => {
  if (apiData?.formatted_date) {
    return apiData.formatted_date;
  }
  if (apiData?.date) {
    return dayjs(apiData.date).format('MMM DD, YYYY');
  }
  return fallbackDate?.format('MMM DD, YYYY') || dayjs().format('MMM DD, YYYY');
};
