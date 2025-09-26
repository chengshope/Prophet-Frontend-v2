import { formatCurrency } from '@/utils/formatters';

export const unitTypeColumns = [
  {
    title: 'Unit Type',
    dataIndex: 'unitType',
    key: 'unitType',
    width: 170,
    fixed: 'left',
    sorter: (a, b) => (a.unitType || '').localeCompare(b.unitType || ''),
    sortDirections: ['ascend', 'descend'],
    render: (value) => <span style={{ fontWeight: 500 }}>{value || 'N/A'}</span>,
  },
  {
    title: 'Beginning Occupancy',
    dataIndex: 'beginningOccupancy',
    key: 'beginningOccupancy',
    width: 140,
    align: 'right',
    responsive: ['md'],
    sorter: (a, b) => {
      const aValue = parseFloat(a.beginningOccupancy?.replace('%', '') || 0);
      const bValue = parseFloat(b.beginningOccupancy?.replace('%', '') || 0);
      return aValue - bValue;
    },
    sortDirections: ['ascend', 'descend'],
    render: (value) => {
      if (!value) return '0.00%';
      const numValue = parseFloat(value.replace('%', '') || 0);
      const color =
        numValue >= 90
          ? 'var(--ant-color-success)'
          : numValue >= 80
            ? 'var(--ant-color-warning)'
            : 'var(--ant-color-error)';
      return <span style={{ color }}>{value}</span>;
    },
  },
  {
    title: 'Ending Occupancy',
    dataIndex: 'endingOccupancy',
    key: 'endingOccupancy',
    width: 140,
    align: 'right',
    responsive: ['md'],
    sorter: (a, b) => {
      const aValue = parseFloat(a.endingOccupancy?.replace('%', '') || 0);
      const bValue = parseFloat(b.endingOccupancy?.replace('%', '') || 0);
      return aValue - bValue;
    },
    sortDirections: ['ascend', 'descend'],
    render: (value) => {
      if (!value) return '0.00%';
      const numValue = parseFloat(value.replace('%', '') || 0);
      const color =
        numValue >= 90
          ? 'var(--ant-color-success)'
          : numValue >= 80
            ? 'var(--ant-color-warning)'
            : 'var(--ant-color-error)';
      return <span style={{ color }}>{value}</span>;
    },
  },
  {
    title: 'Change',
    dataIndex: 'change',
    key: 'change',
    width: 100,
    align: 'right',
    responsive: ['lg'],
    sorter: (a, b) => {
      const aValue = parseFloat(a.change?.replace('%', '') || 0);
      const bValue = parseFloat(b.change?.replace('%', '') || 0);
      return aValue - bValue;
    },
    sortDirections: ['ascend', 'descend'],
    render: (value) => {
      if (!value) return '0.00%';
      const numValue = parseFloat(value.replace('%', '') || 0);
      const color = numValue >= 0 ? 'var(--ant-color-success)' : 'var(--ant-color-error)';
      return <span style={{ color, fontWeight: 500 }}>{value}</span>;
    },
  },
  {
    title: 'Move Ins',
    dataIndex: 'moveIns',
    key: 'moveIns',
    width: 100,
    align: 'right',
    responsive: ['lg'],
    sorter: (a, b) => (a.moveIns || 0) - (b.moveIns || 0),
    sortDirections: ['ascend', 'descend'],
    render: (value) => (value || 0).toLocaleString(),
  },
  {
    title: 'Move Outs',
    dataIndex: 'moveOuts',
    key: 'moveOuts',
    width: 100,
    align: 'right',
    responsive: ['lg'],
    sorter: (a, b) => (a.moveOuts || 0) - (b.moveOuts || 0),
    sortDirections: ['ascend', 'descend'],
    render: (value) => (value || 0).toLocaleString(),
  },
  {
    title: 'Net Move Ins',
    dataIndex: 'netMoveIns',
    key: 'netMoveIns',
    width: 120,
    align: 'right',
    responsive: ['xl'],
    sorter: (a, b) => (a.netMoveIns || 0) - (b.netMoveIns || 0),
    sortDirections: ['ascend', 'descend'],
    render: (value) => {
      const numValue = parseInt(value || 0);
      const color = numValue >= 0 ? 'var(--ant-color-success)' : 'var(--ant-color-error)';
      return <span style={{ color, fontWeight: 500 }}>{numValue.toLocaleString()}</span>;
    },
  },
  {
    title: 'Average Rate',
    dataIndex: 'averageRate',
    key: 'averageRate',
    width: 120,
    align: 'right',
    render: (value) => {
      if (typeof value === 'string' && value.startsWith('$')) {
        return value;
      }
      return formatCurrency(value);
    },
    sorter: (a, b) => {
      const aValue = parseFloat(a.averageRate?.toString().replace(/[$,]/g, '') || 0);
      const bValue = parseFloat(b.averageRate?.toString().replace(/[$,]/g, '') || 0);
      return aValue - bValue;
    },
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Competitor Average',
    dataIndex: 'competitorAverage',
    key: 'competitorAverage',
    width: 140,
    align: 'right',
    responsive: ['xl'],
    render: (value) => {
      if (typeof value === 'string' && value.startsWith('$')) {
        return value;
      }
      return formatCurrency(value);
    },
    sorter: (a, b) => {
      const aValue = parseFloat(a.competitorAverage?.toString().replace(/[$,]/g, '') || 0);
      const bValue = parseFloat(b.competitorAverage?.toString().replace(/[$,]/g, '') || 0);
      return aValue - bValue;
    },
    sortDirections: ['ascend', 'descend'],
  },
];

export const getUnitTypeColumns = () => {
  return unitTypeColumns;
};

export const transformUnitTypeData = (unitTypeAnalysis) => {
  const analysisData = unitTypeAnalysis?.unit_types || [];

  return Array.isArray(analysisData)
    ? analysisData.map((item, index) => ({
        key: index.toString(),
        unitType: item.unit_type || 'N/A',
        beginningOccupancy: item.formatted_beginning_occupancy || item.beginning_occupancy || '0%',
        endingOccupancy: item.formatted_ending_occupancy || item.ending_occupancy || '0%',
        change: item.formatted_change || item.change || '0%',
        moveIns: item.move_ins || 0,
        moveOuts: item.move_outs || 0,
        netMoveIns: item.net_move_ins || 0,
        averageRate: item.formatted_average_rate || item.average_rate || 0,
        competitorAverage: item.formatted_competitor_average || item.competitor_average || 0,
      }))
    : [];
};
