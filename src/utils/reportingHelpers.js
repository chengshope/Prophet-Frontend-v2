import dayjs from 'dayjs';
import { formatCurrency, formatPercent } from './formatters';

/**
 * Date range utilities
 */
export const getDefaultDateRanges = () => ({
  executiveSummary: [dayjs().subtract(30, 'day'), dayjs()],
  streetRates: [dayjs().subtract(30, 'day'), dayjs()],
  existingRates: [dayjs().subtract(3, 'month'), dayjs()],
});

export const formatDateRangeForApi = (dateRange) => {
  if (!dateRange || !Array.isArray(dateRange) || dateRange.length !== 2) {
    return {};
  }

  return {
    startDate: dateRange[0]?.format('YYYY-MM-DD'),
    endDate: dateRange[1]?.format('YYYY-MM-DD'),
  };
};

export const isValidDateRange = (dateRange) => {
  return (
    dateRange &&
    Array.isArray(dateRange) &&
    dateRange.length === 2 &&
    dateRange[0] &&
    dateRange[1] &&
    dayjs.isDayjs(dateRange[0]) &&
    dayjs.isDayjs(dateRange[1])
  );
};

/**
 * API parameter builders
 */
export const buildReportingApiParams = (filters) => {
  const params = {};

  if (filters.dateRange && isValidDateRange(filters.dateRange)) {
    const { startDate, endDate } = formatDateRangeForApi(filters.dateRange);
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
  }

  if (filters.facilityIds && Array.isArray(filters.facilityIds) && filters.facilityIds.length > 0) {
    params.facilityIds = filters.facilityIds;
  }

  return params;
};

/**
 * Data validation utilities
 */
export const isValidReportingData = (data) => {
  return data && typeof data === 'object' && !Array.isArray(data);
};

export const isValidTableData = (data) => {
  return Array.isArray(data) && data.length > 0;
};

export const sanitizeTableData = (data, defaultValue = []) => {
  return isValidTableData(data) ? data : defaultValue;
};

/**
 * Chart data utilities
 */
export const transformChartData = (data, xKey, yKey, labelFormatter = null) => {
  if (!isValidTableData(data)) return [];

  return data.map((item, index) => ({
    key: index.toString(),
    x: item[xKey],
    y: item[yKey],
    label: labelFormatter ? labelFormatter(item[xKey]) : item[xKey],
    value: item[yKey],
  }));
};

export const getChartColors = () => ({
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#13c2c2',
  purple: '#722ed1',
  orange: '#fa8c16',
  cyan: '#13c2c2',
});

/**
 * Metric calculation utilities
 */
export const calculatePercentageChange = (current, previous) => {
  if (!current || !previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const calculateGrowthRate = (values) => {
  if (!Array.isArray(values) || values.length < 2) return 0;

  const firstValue = values[0];
  const lastValue = values[values.length - 1];

  return calculatePercentageChange(lastValue, firstValue);
};

export const formatMetricValue = (value, type = 'number') => {
  if (value === null || value === undefined) return 'N/A';

  switch (type) {
    case 'currency':
      return formatCurrency(value);
    case 'percentage':
      return formatPercent(value / 100);
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : value;
    default:
      return value;
  }
};

/**
 * Color coding utilities for metrics
 */
export const getMetricColor = (value, thresholds = {}) => {
  const { good = 0, warning = -5 } = thresholds;

  if (value >= good) return '#52c41a'; // Green
  if (value >= warning) return '#faad14'; // Orange
  return '#ff4d4f'; // Red
};

export const getOccupancyColor = (occupancy) => {
  const numValue =
    typeof occupancy === 'string' ? parseFloat(occupancy.replace('%', '')) : occupancy;

  return getMetricColor(numValue, { good: 90, warning: 80 });
};

export const getRateChangeColor = (change) => {
  const numValue = typeof change === 'string' ? parseFloat(change.replace('%', '')) : change;

  return numValue >= 0 ? '#52c41a' : '#ff4d4f';
};

/**
 * Filter utilities
 */
export const hasActiveFilters = (filters) => {
  if (!filters || typeof filters !== 'object') return false;

  const hasDateRange = isValidDateRange(filters.dateRange);
  const hasFacilities = Array.isArray(filters.facilityIds) && filters.facilityIds.length > 0;

  return hasDateRange || hasFacilities;
};

export const getFilterSummary = (filters) => {
  if (!hasActiveFilters(filters)) return 'No filters applied';

  const parts = [];

  if (isValidDateRange(filters.dateRange)) {
    const start = filters.dateRange[0].format('MMM DD, YYYY');
    const end = filters.dateRange[1].format('MMM DD, YYYY');
    parts.push(`${start} - ${end}`);
  }

  if (Array.isArray(filters.facilityIds) && filters.facilityIds.length > 0) {
    const count = filters.facilityIds.length;
    parts.push(`${count} ${count === 1 ? 'facility' : 'facilities'}`);
  }

  return parts.join(', ');
};

/**
 * Error handling utilities
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';

  if (typeof error === 'string') return error;

  if (error.message) return error.message;

  if (error.data?.message) return error.data.message;

  if (error.status) {
    switch (error.status) {
      case 404:
        return 'Data not found';
      case 500:
        return 'Server error occurred';
      case 403:
        return 'Access denied';
      default:
        return `Error ${error.status}: ${error.statusText || 'Unknown error'}`;
    }
  }

  return 'An unexpected error occurred';
};

export const shouldShowSkeleton = (isLoading, hasData = false) => {
  // Show skeleton only on initial load
  return isLoading && !hasData;
};

/**
 * Responsive utilities
 */
export const getResponsiveColumns = (screenSize, columns) => {
  const breakpoints = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  };

  return columns.filter((column) => {
    if (!column.responsive) return true;

    return column.responsive.some((bp) => {
      const minWidth = breakpoints[bp];
      return screenSize >= minWidth;
    });
  });
};

/**
 * Export utilities
 */
export const prepareDataForExport = (data, columns) => {
  if (!isValidTableData(data)) return [];

  return data.map((row) => {
    const exportRow = {};
    columns.forEach((column) => {
      const value = row[column.dataIndex];
      exportRow[column.title] = value;
    });
    return exportRow;
  });
};

export const generateExportFilename = (reportType, dateRange) => {
  const timestamp = dayjs().format('YYYY-MM-DD_HH-mm');
  const dateRangeStr = isValidDateRange(dateRange)
    ? `_${dateRange[0].format('YYYY-MM-DD')}_to_${dateRange[1].format('YYYY-MM-DD')}`
    : '';

  return `${reportType}_report${dateRangeStr}_${timestamp}.csv`;
};
