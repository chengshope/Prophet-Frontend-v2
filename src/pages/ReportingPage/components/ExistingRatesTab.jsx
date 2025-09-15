import { useGetExistingCustomersReportQuery } from '@/api/reportingApi';
import { Card, Skeleton, Space, Table } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import Filters from '@/components/common/Filters';

const ExistingRatesTab = () => {
  const [range, setRange] = useState([dayjs().subtract(6, 'month'), dayjs()]);
  const [facility, setFacility] = useState('all');

  // Prepare API parameters
  const apiParams = useMemo(() => {
    const params = {};
    if (range?.[0]) params.startDate = range[0].format('YYYY-MM-DD');
    if (range?.[1]) params.endDate = range[1].format('YYYY-MM-DD');
    if (facility && facility !== 'all') params.facilityIds = [facility];
    return params;
  }, [range, facility]);

  // Fetch data
  const { data: existingCustomersData, isLoading } = useGetExistingCustomersReportQuery(apiParams);

  const columns = [
    {
      title: 'Month',
      dataIndex: 'month',
      render: (date) => dayjs(date).format('MMM YYYY'),
    },
    {
      title: 'Total Increases',
      dataIndex: 'totalIncreases',
      render: (value) => value || 0,
    },
    {
      title: 'Occupied Units',
      dataIndex: 'totalOccupiedUnits',
      render: (value) => value || 0,
    },
    {
      title: 'ECRI %',
      dataIndex: 'ecriPercentage',
      render: (value) => (value ? `${(value * 100).toFixed(1)}%` : '0%'),
    },
    {
      title: 'Revenue Increase',
      dataIndex: 'totalRevenueIncrease',
      render: (value) =>
        value
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(value)
          : '$0.00',
    },
  ];

  // Prepare table data
  const tableData =
    existingCustomersData?.map((item, index) => ({
      key: index,
      month: item.month || item.date,
      totalIncreases: item.totalIncreases || item.total_increases,
      totalOccupiedUnits: item.totalOccupiedUnits || item.total_occupied_units,
      ecriPercentage: item.ecriPercentage || item.ecri_percentage,
      totalRevenueIncrease: item.totalRevenueIncrease || item.total_revenue_increase,
    })) || [];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Filters
        dateRange={range}
        onDateRangeChange={setRange}
        facility={facility}
        onFacilityChange={setFacility}
        picker="month"
      />
      <Card title="Existing Customer Rate Increases">
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={{
              pageSize: 12,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            size="middle"
          />
        )}
      </Card>
    </Space>
  );
};

export default ExistingRatesTab;
