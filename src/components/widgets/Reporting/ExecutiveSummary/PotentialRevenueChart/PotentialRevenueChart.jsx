import { useGetGrossPotentialRevenueOverTimeQuery } from '@/api/reportingApi';
import LineChart from '@/components/common/LineChart';
import { formatRevenue } from '@/utils/formatters';
import { Col } from 'antd';
import { useMemo } from 'react';

const PotentialRevenueChart = ({ apiParams }) => {
  const {
    data: potentialRevenueOverTime,
    isLoading: loadingPotentialChart,
    isFetching: fetchingPotentialChart,
  } = useGetGrossPotentialRevenueOverTimeQuery(apiParams);

  const formattedPotentialData = useMemo(() => {
    const potentialData = potentialRevenueOverTime?.data || [];

    return Array.isArray(potentialData)
      ? potentialData.map((item) => {
        return {
          date: item.date,
          potential: item.gross_potential_revenue || item.potential_revenue || 0,
          formattedDate: item.formatted_date,
        };
      })
      : [];
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
