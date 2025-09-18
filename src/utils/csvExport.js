import dayjs from 'dayjs';

/**
 * Downloads CSV content as a file
 * @param {string} csvContent - The CSV content to download
 * @param {string} filename - The filename (without extension)
 */
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const formattedDate = dayjs().format('YYYY_MM_DD');
  link.setAttribute('download', `${formattedDate}_${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Handles CSV export with error handling
 * @param {Function} exportFunction - The function that returns CSV data
 * @param {string} filename - The filename for the CSV
 * @param {Function} showSuccess - Success message function
 * @param {Function} showError - Error message function
 */
export const handleCSVExport = async (exportFunction, filename, showSuccess, showError) => {
  try {
    const csvContent = await exportFunction();
    downloadCSV(csvContent, filename);
    showSuccess('CSV exported successfully');
  } catch (error) {
    console.error('Error exporting CSV:', error);
    showError('Failed to export CSV');
  }
};
