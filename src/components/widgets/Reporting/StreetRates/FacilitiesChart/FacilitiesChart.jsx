import { useMemo } from 'react';
import { Col } from 'antd';
import MultiLineChart from '@/components/common/MultiLineChart';
import { useGetOccupancyByFacilitiesQuery } from '@/api/reportingApi';
import { formatOccupancy } from '@/utils/formatters';

const FacilitiesChart = ({ apiParams }) => {
  const {
    data: occupancyByFacilities,
    isLoading: loadingFacilitiesChart,
    isFetching: fetchingFacilitiesChart,
  } = useGetOccupancyByFacilitiesQuery(apiParams);

  const formattedFacilitiesData = useMemo(() => {
    const facilitiesData = occupancyByFacilities?.facilities || [];

    return Array.isArray(facilitiesData)
      ? facilitiesData.map((facility) => {
          return {
            facilityId: facility.facility_id,
            facilityName: facility.facility_name,
            data:
              facility.data?.map((item) => ({
                date: item.date,
                occupancy: item.occupancy_percentage || item.occupancy || 0,
                formattedDate: item.formatted_date,
              })) || [],
          };
        })
      : [];
  }, [occupancyByFacilities]);

  return (
    <Col xs={24} lg={12}>
      <MultiLineChart
        data={formattedFacilitiesData}
        dataKey="occupancy"
        title="Occupancy by Facilities"
        formatter={formatOccupancy}
        tooltipLabel="Occupancy"
        domain={[0, 'dataMax + 4']}
        loading={loadingFacilitiesChart || fetchingFacilitiesChart}
      />
    </Col>
  );
};

export default FacilitiesChart;
