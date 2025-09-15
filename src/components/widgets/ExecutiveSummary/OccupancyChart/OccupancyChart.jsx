import { useMemo } from 'react';
import { Col } from 'antd';
import LineChart from '@/components/common/LineChart';
import { useGetOccupancyOverTimeQuery } from '@/api/reportingApi';
import { formatOccupancy } from '../ExecutiveSummaryTab/utils';

const OccupancyChart = ({ apiParams }) => {
  const {
    data: occupancyOverTime,
    isLoading: loadingOccupancyChart,
    isFetching: fetchingOccupancyChart,
  } = useGetOccupancyOverTimeQuery(apiParams);

  // Format data for chart
  const formattedOccupancyData = useMemo(() => {
    console.log('OccupancyChart - Raw API response:', occupancyOverTime);
    const occupancyData = occupancyOverTime?.data || [];
    console.log('OccupancyChart - Extracted data:', occupancyData);

    return Array.isArray(occupancyData)
      ? occupancyData.map((item) => {
          console.log('OccupancyChart - Processing item:', item);
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
        title="Occupancy Over Time"
        color="#52c41a"
        formatter={formatOccupancy}
        tooltipLabel="Occupancy"
        domain={[0, 'dataMax + 4']}
        loading={loadingOccupancyChart || fetchingOccupancyChart}
      />
    </Col>
  );
};

export default OccupancyChart;
