import { useGetExistingCustomersReportQuery } from '@/api/reportingApi';
import { Table } from 'antd';
import { RiseOutlined } from '@ant-design/icons';
import { useMemo } from 'react';

const ExistingRatesTable = ({ apiParams }) => {
  const {
    data: existingCustomersData,
    isLoading,
    isFetching,
  } = useGetExistingCustomersReportQuery(apiParams);

  const columns = [
    {
      title: 'Month',
      dataIndex: 'month',
    },
    {
      title: 'Total No. of Increases',
      dataIndex: 'totalIncreases',
    },
    {
      title: 'Total Occupied Units',
      dataIndex: 'totalOccupiedUnits',
    },
    {
      title: 'ECRI %',
      dataIndex: 'ecriPercentage',
    },
    {
      title: 'Total Revenue Increase',
      dataIndex: 'totalRevenueIncrease',
    },
    {
      title: 'Avg. Move-out Probability',
      dataIndex: 'avgMoveOutProbability',
    },
    {
      title: 'ECRI Move-outs to Date',
      dataIndex: 'ecriMoveOuts',
    },
  ];

  const tableData = useMemo(() => {
    const data = existingCustomersData?.data || [];
    if (!Array.isArray(data)) return [];

    return data.map((item, index) => ({
      key: index.toString(),
      month: item.month,
      totalIncreases: item.total_increases,
      totalOccupiedUnits: item.total_occupied_units.toLocaleString(),
      ecriPercentage: item.formatted_ecri_percentage,
      totalRevenueIncrease: item.formatted_revenue_increase,
      avgMoveOutProbability: item.formatted_move_out_probability,
      ecriMoveOuts: item.ecri_move_outs,
    }));
  }, [existingCustomersData]);

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      bordered
      loading={isLoading || isFetching}
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
            <RiseOutlined style={{ fontSize: '48px', marginBottom: '16px', color: '#d9d9d9' }} />
            <div
              style={{
                fontSize: '16px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#595959',
              }}
            >
              No Rate Increase Data
            </div>
            <div style={{ fontSize: '14px', textAlign: 'center', lineHeight: '1.5' }}>
              Existing customer rate increases will appear here when data is available.
              <br />
              Try selecting a different month or facility.
            </div>
          </div>
        ),
      }}
      pagination={{
        pageSize: 12,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
      size="middle"
    />
  );
};

export default ExistingRatesTable;
