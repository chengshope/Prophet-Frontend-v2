import { Space } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import Filters from '@/components/common/Filters';
import ExistingRatesTable from '../ExistingRatesTable';

const ExistingRatesTab = () => {
  const [range, setRange] = useState([dayjs().subtract(3, 'month'), dayjs()]);
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
        picker="month"
      />

      <ExistingRatesTable apiParams={apiParams} />
    </Space>
  );
};

export default ExistingRatesTab;
