import { useMemo } from 'react';
import { Col } from 'antd';
import LineChart from '@/components/common/LineChart';
import { useGetGrossRentalRevenueOverTimeQuery } from '@/api/reportingApi';
import { formatRevenue } from '../ExecutiveSummaryTab/utils';

const RevenueChart = ({ apiParams }) => {
  const {
    data: revenueOverTime,
    isLoading: loadingRevenueChart,
    isFetching: fetchingRevenueChart,
  } = useGetGrossRentalRevenueOverTimeQuery(apiParams);

  // Format data for chart
  const formattedRevenueData = useMemo(() => {
    console.log('RevenueChart - Raw API response:', revenueOverTime);
    const revenueData = revenueOverTime?.data || [];
    console.log('RevenueChart - Extracted data:', revenueData);

    const result = Array.isArray(revenueData)
      ? revenueData.map((item) => {
          console.log('RevenueChart - Processing item:', item);
          const revenue = item.gross_rental_revenue || item.revenue || 0;
          console.log('RevenueChart - Extracted revenue value:', revenue);
          return {
            date: item.date,
            revenue: revenue,
            formattedDate: item.formatted_date,
          };
        })
      : [];

    console.log('RevenueChart - Final formatted data:', result);
    return result;
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
