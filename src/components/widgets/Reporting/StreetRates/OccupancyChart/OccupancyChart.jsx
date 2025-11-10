import { useGetOccupancyOverTimeQuery } from '@/api/reportingApi';
import LineChart from '@/components/common/LineChart';
import { formatOccupancy } from '@/utils/formatters';
import { Col } from 'antd';
import { useMemo } from 'react';

const OccupancyChart = ({ apiParams }) => {
  const { facilityIds, ...rest } = apiParams || {};
  const {
    data: occupancyOverTime,
    isLoading: loadingOccupancyChart,
    isFetching: fetchingOccupancyChart,
  } = useGetOccupancyOverTimeQuery(rest);

  const formattedOccupancyData = useMemo(() => {
    const occupancyData = occupancyOverTime?.data || [];

    return Array.isArray(occupancyData)
      ? occupancyData.map((item) => {
        return {
          date: item.date,
          occupancy: item.occupancy_percentage || item.occupancy || 0,
          formattedDate: item.formatted_date,
        };
      })
      : [];
  }, [occupancyOverTime]);

  return (
    <Col xs={24} lg={12}>
      <LineChart
        data={formattedOccupancyData}
        dataKey="occupancy"
        title="Portfolio Occupancy Over Time"
        color="#1890ff"
        formatter={formatOccupancy}
        tooltipLabel="Occupancy"
        domain={[0, 'dataMax + 4']}
        loading={loadingOccupancyChart || fetchingOccupancyChart}
      />
    </Col>
  );
};

export default OccupancyChart;
