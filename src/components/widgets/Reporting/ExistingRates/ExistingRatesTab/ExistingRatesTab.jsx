import { Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import ReportingFilters from '@/components/common/ReportingFilters';
import ExistingRatesTable from '../ExistingRatesTable';
import {
  setExistingRatesFilters,
  resetExistingRatesFilters,
} from '@/features/reporting/reportingSlice';
import {
  selectExistingRatesFilters,
  selectExistingRatesApiParams,
} from '@/features/reporting/reportingSelector';

const ExistingRatesTab = () => {
  const dispatch = useDispatch();

  // Get filters from Redux store
  const filters = useSelector(selectExistingRatesFilters);
  const apiParams = useSelector(selectExistingRatesApiParams);

  const handleDateRangeChange = (dateRange) => {
    dispatch(setExistingRatesFilters({ dateRange }));
  };

  const handleFacilityChange = (facilityIds) => {
    dispatch(setExistingRatesFilters({ facilityIds }));
  };

  const handleReset = () => {
    dispatch(resetExistingRatesFilters());
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <ReportingFilters
        dateRange={filters.dateRange}
        onDateRangeChange={handleDateRangeChange}
        facility={filters.facilityIds}
        onFacilityChange={handleFacilityChange}
        onReset={handleReset}
        picker="month"
        dateFormat="YYYY-MM"
        placeholder="All facilities"
      />

      <ExistingRatesTable apiParams={apiParams} />
    </Space>
  );
};

export default ExistingRatesTab;
