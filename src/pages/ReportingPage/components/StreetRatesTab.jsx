import { useGetOccupancyOverTimeQuery, useGetStreetRatesReportQuery } from '@/api/reportingApi';
import { Card, Col, Empty, Row, Skeleton, Space, Table } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import Filters from '@/components/common/Filters';

const StreetRatesTab = () => {
  const [range, setRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);
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
  const {
    data: streetRatesData,
    isLoading: loadingStreetRates,
    isFetching: fetchingStreetRates,
  } = useGetStreetRatesReportQuery(apiParams);
  const {
    data: occupancyOverTime,
    isLoading: loadingOccupancyChart,
    isFetching: fetchingOccupancyChart,
  } = useGetOccupancyOverTimeQuery(apiParams);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Occupancy',
      dataIndex: 'occupancy',
      render: (value) => (value ? `${(value * 100).toFixed(1)}%` : 'N/A'),
    },
    {
      title: 'Avg Rate',
      dataIndex: 'avgRate',
      responsive: ['md'],
      render: (value) =>
        value
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(value)
          : 'N/A',
    },
  ];

  // Prepare table data
  const tableData =
    streetRatesData?.map((item, index) => ({
      key: index,
      date: item.date,
      occupancy: item.occupancy,
      avgRate: item.avgRate || item.average_rate,
    })) || [];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Filters
        dateRange={range}
        onDateRangeChange={setRange}
        facility={facility}
        onFacilityChange={setFacility}
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Occupancy Over Time">
            {loadingOccupancyChart || fetchingOccupancyChart ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : occupancyOverTime?.length > 0 ? (
              <Empty description="Chart component coming soon" />
            ) : (
              <Empty description="No data available" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Street Rates Summary">
            {loadingStreetRates || fetchingStreetRates ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : streetRatesData?.length > 0 ? (
              <Empty description="Chart component coming soon" />
            ) : (
              <Empty description="No data available" />
            )}
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Street Rates Data">
            {loadingStreetRates || fetchingStreetRates ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
                size="middle"
              />
            )}
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default StreetRatesTab;
