import dayjs from 'dayjs';

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
