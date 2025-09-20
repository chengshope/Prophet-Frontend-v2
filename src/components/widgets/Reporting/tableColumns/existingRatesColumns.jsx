/**
 * Table column definitions for Existing Rates reporting table
 * Following Rule #4: Table Header Column extraction
 */

export const existingRatesColumns = [
  {
    title: 'Month',
    dataIndex: 'month',
    key: 'month',
    width: 120,
    sorter: (a, b) => (a.month || '').localeCompare(b.month || ''),
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Total No. of Increases',
    dataIndex: 'totalIncreases',
    key: 'totalIncreases',
    width: 180,
    align: 'right',
    sorter: (a, b) => (a.totalIncreases || 0) - (b.totalIncreases || 0),
    sortDirections: ['ascend', 'descend'],
    render: (value) => value?.toLocaleString() || '0',
  },
  {
    title: 'Total Occupied Units',
    dataIndex: 'totalOccupiedUnits',
    key: 'totalOccupiedUnits',
    width: 160,
    align: 'right',
    responsive: ['md'],
    sorter: (a, b) => {
      const aValue = parseInt(a.totalOccupiedUnits?.toString().replace(/,/g, '') || 0);
      const bValue = parseInt(b.totalOccupiedUnits?.toString().replace(/,/g, '') || 0);
      return aValue - bValue;
    },
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'ECRI %',
    dataIndex: 'ecriPercentage',
    key: 'ecriPercentage',
    width: 100,
    align: 'right',
    sorter: (a, b) => {
      const aValue = parseFloat(a.ecriPercentage?.replace('%', '') || 0);
      const bValue = parseFloat(b.ecriPercentage?.replace('%', '') || 0);
      return aValue - bValue;
    },
    sortDirections: ['ascend', 'descend'],
    render: (value) => {
      if (!value) return '0.00%';
      const numValue = parseFloat(value.replace('%', '') || 0);
      const color =
        numValue >= 5
          ? 'var(--ant-color-success)'
          : numValue >= 2
            ? 'var(--ant-color-warning)'
            : 'var(--ant-color-error)';
      return <span style={{ color }}>{value}</span>;
    },
  },
  {
    title: 'Total Revenue Increase',
    dataIndex: 'totalRevenueIncrease',
    key: 'totalRevenueIncrease',
    width: 180,
    align: 'right',
    responsive: ['lg'],
    sorter: (a, b) => {
      const aValue = parseFloat(a.totalRevenueIncrease?.toString().replace(/[$,]/g, '') || 0);
      const bValue = parseFloat(b.totalRevenueIncrease?.toString().replace(/[$,]/g, '') || 0);
      return aValue - bValue;
    },
    sortDirections: ['ascend', 'descend'],
    render: (value) => {
      if (!value) return '$0.00';
      const numValue = parseFloat(value.toString().replace(/[$,]/g, '') || 0);
      const color = numValue >= 0 ? 'var(--ant-color-success)' : 'var(--ant-color-error)';
      return <span style={{ color }}>{value}</span>;
    },
  },
  {
    title: 'Avg. Move-out Probability',
    dataIndex: 'avgMoveOutProbability',
    key: 'avgMoveOutProbability',
    width: 180,
    align: 'right',
    responsive: ['lg'],
    sorter: (a, b) => {
      const aValue = parseFloat(a.avgMoveOutProbability?.replace('%', '') || 0);
      const bValue = parseFloat(b.avgMoveOutProbability?.replace('%', '') || 0);
      return aValue - bValue;
    },
    sortDirections: ['ascend', 'descend'],
    render: (value) => {
      if (!value) return '0.00%';
      const numValue = parseFloat(value.replace('%', '') || 0);
      const color =
        numValue <= 10
          ? 'var(--ant-color-success)'
          : numValue <= 20
            ? 'var(--ant-color-warning)'
            : 'var(--ant-color-error)';
      return <span style={{ color }}>{value}</span>;
    },
  },
  {
    title: 'ECRI Move-outs to Date',
    dataIndex: 'ecriMoveOuts',
    key: 'ecriMoveOuts',
    width: 160,
    align: 'right',
    responsive: ['xl'],
    sorter: (a, b) => (a.ecriMoveOuts || 0) - (b.ecriMoveOuts || 0),
    sortDirections: ['ascend', 'descend'],
    render: (value) => value?.toLocaleString() || '0',
  },
];

// Responsive column configuration for mobile
export const existingRatesColumnsMobile = [
  {
    title: 'Month',
    dataIndex: 'month',
    key: 'month',
    width: 100,
  },
  {
    title: 'Increases',
    dataIndex: 'totalIncreases',
    key: 'totalIncreases',
    width: 100,
    align: 'right',
    render: (value) => value?.toLocaleString() || '0',
  },
  {
    title: 'ECRI %',
    dataIndex: 'ecriPercentage',
    key: 'ecriPercentage',
    width: 80,
    align: 'right',
    render: (value) => {
      if (!value) return '0.00%';
      const numValue = parseFloat(value.replace('%', '') || 0);
      const color =
        numValue >= 5
          ? 'var(--ant-color-success)'
          : numValue >= 2
            ? 'var(--ant-color-warning)'
            : 'var(--ant-color-error)';
      return <span style={{ color }}>{value}</span>;
    },
  },
  {
    title: 'Revenue',
    dataIndex: 'totalRevenueIncrease',
    key: 'totalRevenueIncrease',
    width: 100,
    align: 'right',
    render: (value) => {
      if (!value) return '$0';
      // Abbreviated format for mobile
      const numValue = parseFloat(value.toString().replace(/[$,]/g, '') || 0);
      const color = numValue >= 0 ? 'var(--ant-color-success)' : 'var(--ant-color-error)';
      if (numValue >= 1000000) {
        return <span style={{ color }}>${(numValue / 1000000).toFixed(1)}M</span>;
      } else if (numValue >= 1000) {
        return <span style={{ color }}>${(numValue / 1000).toFixed(1)}K</span>;
      }
      return <span style={{ color }}>${numValue.toFixed(0)}</span>;
    },
  },
];
