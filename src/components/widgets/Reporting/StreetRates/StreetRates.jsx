/**
 * Street Rates component for Reporting widget
 * Following Rule #4: components/widgets/Reporting/StreetRates
 */

import { Row, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import ReportingFilters from '@/components/common/ReportingFilters';
import FacilitiesChart from '@/components/widgets/StreetRates/FacilitiesChart';
import OccupancyChart from '@/components/widgets/StreetRates/OccupancyChart';
import UnitTypeTable from './UnitTypeTable';
import {
  setStreetRatesFilters,
  resetStreetRatesFilters,
} from '@/features/reporting/reportingSlice';
import {
  selectStreetRatesFilters,
  selectStreetRatesApiParams,
} from '@/features/reporting/reportingSelector';

const StreetRates = () => {
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
        <FacilitiesChart apiParams={apiParams} />
        <OccupancyChart apiParams={apiParams} />
      </Row>

      <UnitTypeTable apiParams={apiParams} />
    </Space>
  );
};

export default StreetRates;
