import { useMemo } from 'react';
import { Col } from 'antd';
import LineChart from '@/components/common/LineChart';
import { useGetOccupancyOverTimeQuery } from '@/api/reportingApi';
import { formatOccupancy } from '@/utils/formatters';

const OccupancyChart = ({ apiParams }) => {
  const {
    data: occupancyOverTime,
    isLoading: loadingOccupancyChart,
    isFetching: fetchingOccupancyChart,
  } = useGetOccupancyOverTimeQuery(apiParams);

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
