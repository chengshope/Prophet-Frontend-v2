import { useMemo } from 'react';
import { Col } from 'antd';
import LineChart from '@/components/common/LineChart';
import { useGetGrossPotentialRevenueOverTimeQuery } from '@/api/reportingApi';
import { formatRevenue } from '../ExecutiveSummaryTab/utils';

const PotentialRevenueChart = ({ apiParams }) => {
  const {
    data: potentialRevenueOverTime,
    isLoading: loadingPotentialChart,
    isFetching: fetchingPotentialChart,
  } = useGetGrossPotentialRevenueOverTimeQuery(apiParams);

  // Format data for chart
  const formattedPotentialData = useMemo(() => {
    console.log('PotentialRevenueChart - Raw API response:', potentialRevenueOverTime);
    const potentialData =
      potentialRevenueOverTime?.data?.data || potentialRevenueOverTime?.data || [];
    console.log('PotentialRevenueChart - Extracted data:', potentialData);

    const result = Array.isArray(potentialData)
      ? potentialData.map((item) => {
          console.log('PotentialRevenueChart - Processing item:', item);
          const potential = item.gross_potential_revenue || item.potential_revenue || 0;
          console.log('PotentialRevenueChart - Extracted potential value:', potential);
          return {
            date: item.date,
            potential: potential,
            formattedDate: item.formatted_date,
          };
        })
      : [];

    console.log('PotentialRevenueChart - Final formatted data:', result);
    return result;
  }, [potentialRevenueOverTime]);

  return (
    <Col xs={24} lg={12}>
      <LineChart
        data={formattedPotentialData}
        dataKey="potential"
        title="Gross Potential Revenue Over Time"
        color="#fa8c16"
        strokeWidth={1}
        formatter={formatRevenue}
        tooltipLabel="Potential Revenue"
        domain={[0, 'dataMax + 10000']}
        loading={loadingPotentialChart || fetchingPotentialChart}
      />
    </Col>
  );
};

export default PotentialRevenueChart;
