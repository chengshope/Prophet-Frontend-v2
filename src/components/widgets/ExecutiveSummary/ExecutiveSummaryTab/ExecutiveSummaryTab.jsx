import { Row, Space } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import Filters from '@/components/common/Filters';
import MetricCards from '../MetricCards';
import RevenueChart from '../RevenueChart';
import OccupancyChart from '../OccupancyChart';
import PotentialRevenueChart from '../PotentialRevenueChart';
import RevPAFChart from '../RevPAFChart';

const ExecutiveSummaryTab = () => {
  const [range, setRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);
  const [facility, setFacility] = useState([]); // Changed to array for multi-select

  const apiParams = useMemo(() => {
    const params = {};
    if (range?.[0]) params.startDate = range[0].format('YYYY-MM-DD');
    if (range?.[1]) params.endDate = range[1].format('YYYY-MM-DD');
    // Handle multi-select facility IDs
    if (facility && facility.length > 0) {
      params.facilityIds = facility;
    }
    console.log('ExecutiveSummaryTab - API Params:', params);
    console.log('ExecutiveSummaryTab - Date range:', range);
    console.log('ExecutiveSummaryTab - Facility:', facility);
    return params;
  }, [range, facility]);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Filters
        dateRange={range}
        onDateRangeChange={setRange}
        facility={facility}
        onFacilityChange={setFacility}
      />

      <MetricCards apiParams={apiParams} range={range} />

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

export default ExecutiveSummaryTab;
