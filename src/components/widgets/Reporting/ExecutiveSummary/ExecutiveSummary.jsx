/**
 * Executive Summary component for Reporting widget
 * Following Rule #4: components/widgets/Reporting/ExecutiveSummary
 */

import { Row, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import ReportingFilters from '@/components/common/ReportingFilters';
import MetricCards from './MetricCards';
import RevenueChart from './RevenueChart';
import OccupancyChart from './OccupancyChart';
import PotentialRevenueChart from './PotentialRevenueChart';
import RevPAFChart from './RevPAFChart';
import {
  setExecutiveSummaryFilters,
  resetExecutiveSummaryFilters,
} from '@/features/reporting/reportingSlice';
import {
  selectExecutiveSummaryFilters,
  selectExecutiveSummaryApiParams,
} from '@/features/reporting/reportingSelector';

const ExecutiveSummary = () => {
  const dispatch = useDispatch();

  // Get filters from Redux store
  const filters = useSelector(selectExecutiveSummaryFilters);
  const apiParams = useSelector(selectExecutiveSummaryApiParams);

  const handleDateRangeChange = (dateRange) => {
    dispatch(setExecutiveSummaryFilters({ dateRange }));
  };

  const handleFacilityChange = (facilityIds) => {
    dispatch(setExecutiveSummaryFilters({ facilityIds }));
  };

  const handleReset = () => {
    dispatch(resetExecutiveSummaryFilters());
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

      <MetricCards apiParams={apiParams} range={filters.dateRange} />

      <Row gutter={[16, 16]}>
        <RevenueChart apiParams={apiParams} />
        <OccupancyChart apiParams={apiParams} />
      </Row>

      <Row gutter={[16, 16]}>
        <PotentialRevenueChart apiParams={apiParams} />
        <RevPAFChart apiParams={apiParams} />
      </Row>
    </Space>
  );
};

export default ExecutiveSummary;
