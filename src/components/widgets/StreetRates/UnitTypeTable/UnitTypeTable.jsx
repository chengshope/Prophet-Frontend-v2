import { useMemo } from 'react';
import { Card, Table } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { useGetUnitTypeAnalysisQuery } from '@/api/reportingApi';
import { formatCurrency } from '@/utils/formatters';

const UnitTypeTable = ({ apiParams }) => {
  const {
    data: unitTypeAnalysis,
    isLoading: loadingTable,
    isFetching: fetchingTable,
  } = useGetUnitTypeAnalysisQuery(apiParams);

  const columns = [
    {
      title: 'Unit Type',
      dataIndex: 'unitType',
      key: 'unitType',
      width: 170,
      fixed: 'left',
      sorter: (a, b) => (a.unitType || '').localeCompare(b.unitType || ''),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Beginning Occupancy',
      dataIndex: 'beginningOccupancy',
      key: 'beginningOccupancy',
      width: 140,
      responsive: ['md'],
      sorter: (a, b) => {
        const aValue = parseFloat(a.beginningOccupancy?.replace('%', '') || 0);
        const bValue = parseFloat(b.beginningOccupancy?.replace('%', '') || 0);
        return aValue - bValue;
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Ending Occupancy',
      dataIndex: 'endingOccupancy',
      key: 'endingOccupancy',
      width: 140,
      responsive: ['md'],
      sorter: (a, b) => {
        const aValue = parseFloat(a.endingOccupancy?.replace('%', '') || 0);
        const bValue = parseFloat(b.endingOccupancy?.replace('%', '') || 0);
        return aValue - bValue;
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Change',
      dataIndex: 'change',
      key: 'change',
      width: 100,
      responsive: ['lg'],
      sorter: (a, b) => {
        const aValue = parseFloat(a.change?.replace('%', '') || 0);
        const bValue = parseFloat(b.change?.replace('%', '') || 0);
        return aValue - bValue;
      },
      sortDirections: ['ascend', 'descend'],
      render: (value) => {
        const numValue = parseFloat(value?.replace('%', '') || 0);
        const color = numValue >= 0 ? '#52c41a' : '#ff4d4f';
        return <span style={{ color }}>{value}</span>;
      },
    },
    {
      title: 'Move Ins',
      dataIndex: 'moveIns',
      key: 'moveIns',
      width: 100,
      responsive: ['lg'],
      sorter: (a, b) => (a.moveIns || 0) - (b.moveIns || 0),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Move Outs',
      dataIndex: 'moveOuts',
      key: 'moveOuts',
      width: 100,
      responsive: ['lg'],
      sorter: (a, b) => (a.moveOuts || 0) - (b.moveOuts || 0),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Net Move Ins',
      dataIndex: 'netMoveIns',
      key: 'netMoveIns',
      width: 120,
      responsive: ['xl'],
      sorter: (a, b) => (a.netMoveIns || 0) - (b.netMoveIns || 0),
      sortDirections: ['ascend', 'descend'],
      render: (value) => {
        const numValue = parseInt(value || 0);
        const color = numValue >= 0 ? '#52c41a' : '#ff4d4f';
        return <span style={{ color }}>{value}</span>;
      },
    },
    {
      title: 'Average Rate',
      dataIndex: 'averageRate',
      key: 'averageRate',
      width: 120,
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

  const tableData = useMemo(() => {
    const analysisData = unitTypeAnalysis?.unit_types || [];

    return Array.isArray(analysisData)
      ? analysisData.map((item, index) => {
          return {
            key: index.toString(),
            unitType: item.unit_type || 'N/A',
            beginningOccupancy:
              item.formatted_beginning_occupancy || item.beginning_occupancy || '0%',
            endingOccupancy: item.formatted_ending_occupancy || item.ending_occupancy || '0%',
            change: item.formatted_change || item.change || '0%',
            moveIns: item.move_ins || 0,
            moveOuts: item.move_outs || 0,
            netMoveIns: item.net_move_ins || 0,
            averageRate: item.formatted_average_rate || item.average_rate || 0,
            competitorAverage: item.formatted_competitor_average || item.competitor_average || 0,
          };
        })
      : [];
  }, [unitTypeAnalysis]);

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      loading={loadingTable || fetchingTable}
      bordered
      locale={{
        emptyText: (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '40px 20px',
              color: '#8c8c8c',
            }}
          >
            <BarChartOutlined
              style={{ fontSize: '48px', marginBottom: '16px', color: '#d9d9d9' }}
            />
            <div
              style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px', color: '#595959' }}
            >
              No Unit Type Data
            </div>
            <div style={{ fontSize: '14px', textAlign: 'center', lineHeight: '1.5' }}>
              Unit type analysis will appear here when data is available.
              <br />
              Try adjusting your date range or facility selection.
            </div>
          </div>
        ),
      }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
      size="middle"
      scroll={{ x: 1200 }}
    />
  );
};

export default UnitTypeTable;
