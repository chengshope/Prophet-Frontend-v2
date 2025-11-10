import { useGetGrossRentalRevenueOverTimeQuery } from '@/api/reportingApi';
import LineChart from '@/components/common/LineChart';
import { formatRevenue } from '@/utils/formatters';
import { Col } from 'antd';
import { useMemo } from 'react';

const RevenueChart = ({ apiParams }) => {
  const {
    data: revenueOverTime,
    isLoading: loadingRevenueChart,
    isFetching: fetchingRevenueChart,
  } = useGetGrossRentalRevenueOverTimeQuery(apiParams);

  const formattedRevenueData = useMemo(() => {
    const revenueData = revenueOverTime?.data || [];

    return Array.isArray(revenueData)
      ? revenueData.map((item) => {
        return {
          date: item.date,
          revenue: item.gross_rental_revenue || item.revenue || 0,
          formattedDate: item.formatted_date,
        };
      })
      : [];
  }, [revenueOverTime]);

  return (
    <Col xs={24} lg={12}>
      <LineChart
        data={formattedRevenueData}
        dataKey="revenue"
        title="Gross Rental Revenue Over Time"
        color="#1890ff"
        formatter={formatRevenue}
        tooltipLabel="Revenue"
        domain={[0, 'dataMax + 100000']}
        loading={loadingRevenueChart || fetchingRevenueChart}
      />
    </Col>
  );
};

export default RevenueChart;
