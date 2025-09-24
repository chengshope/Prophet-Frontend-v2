import { Row, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import ReportingFilters from '@/components/common/ReportingFilters';
import OccupancyChart from '../OccupancyChart';
import FacilitiesChart from '../FacilitiesChart';
import UnitTypeTable from '../UnitTypeTable';
import {
  setStreetRatesFilters,
  resetStreetRatesFilters,
} from '@/features/reporting/reportingSlice';
import {
  selectStreetRatesFilters,
  selectStreetRatesApiParams,
} from '@/features/reporting/reportingSelector';

const StreetRatesTab = () => {
  const dispatch = useDispatch();

  // Get filters from Redux store
  const filters = useSelector(selectStreetRatesFilters);
  const apiParams = useSelector(selectStreetRatesApiParams);

  const handleDateRangeChange = (dateRange) => {
    dispatch(setStreetRatesFilters({ dateRange }));
  };

  const handleFacilityChange = (facilityIds) => {
    dispatch(setStreetRatesFilters({ facilityIds }));
  };

  const handleReset = () => {
    dispatch(resetStreetRatesFilters());
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <ReportingFilters
        dateRange={filters.dateRange}
        onDateRangeChange={handleDateRangeChange}
        facility={filters.facilityIds}
        onFacilityChange={handleFacilityChange}
        onReset={handleReset}
        placeholder="All facilities"
      />

      <Row gutter={[16, 16]}>
        <OccupancyChart apiParams={apiParams} />
        <FacilitiesChart apiParams={apiParams} />
      </Row>

      <UnitTypeTable apiParams={apiParams} />
    </Space>
  );
};

export default StreetRatesTab;
