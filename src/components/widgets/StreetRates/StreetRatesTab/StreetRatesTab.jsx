import { Row, Space } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import Filters from '@/components/common/Filters';
import OccupancyChart from '../OccupancyChart';
import FacilitiesChart from '../FacilitiesChart';
import UnitTypeTable from '../../Reporting/StreetRates/UnitTypeTable';

const StreetRatesTab = () => {
  const [range, setRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);
  const [facility, setFacility] = useState([]);

  const apiParams = useMemo(() => {
    const params = {};
    if (range?.[0]) params.startDate = range[0].format('YYYY-MM-DD');
    if (range?.[1]) params.endDate = range[1].format('YYYY-MM-DD');
    if (facility && facility.length > 0) {
      params.facilityIds = facility;
    }
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

      <Row gutter={[16, 16]}>
        <OccupancyChart apiParams={apiParams} />
        <FacilitiesChart apiParams={apiParams} />
      </Row>

      <UnitTypeTable apiParams={apiParams} />
    </Space>
  );
};

export default StreetRatesTab;
