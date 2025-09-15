import { useGetFacilitiesQuery } from '@/api/facilitiesApi';
import { Col, DatePicker, Row, Select } from 'antd';

const { RangePicker } = DatePicker;

const Filters = ({ dateRange, onDateRangeChange, facility, onFacilityChange, picker }) => {
  // Fetch facilities for the dropdown
  const {
    data: facilities = [],
    isLoading: facilitiesLoading,
    error: facilitiesError,
  } = useGetFacilitiesQuery();

  // Fallback mock data when API fails (for development)
  const mockFacilities = [
    { id: 1, facility_name: 'Downtown Storage', name: 'Downtown Storage' },
    { id: 2, facility_name: 'Westside Storage', name: 'Westside Storage' },
    { id: 3, facility_name: 'Northgate Storage', name: 'Northgate Storage' },
  ];

  // Use mock data if there's an error or no facilities returned
  const facilitiesData = facilitiesError || facilities.length === 0 ? mockFacilities : facilities;

  // Prepare facility options (remove "All Facilities" for multi-select)
  const facilityOptions = facilitiesData.map((f) => ({
    label: f.name || f.facility_name || `Facility ${f.id}`,
    value: f.id,
  }));

  return (
    <Row gutter={[16, 8]} align="middle" justify="space-between">
      <Col xs={24} md={12}>
        <RangePicker
          value={dateRange}
          onChange={onDateRangeChange}
          allowClear={false}
          picker={picker}
        />
      </Col>
      <Col xs={24} md={12} className="actions-col">
        <Select
          mode="multiple"
          value={facility}
          onChange={onFacilityChange}
          loading={facilitiesLoading}
          options={facilityOptions}
          placeholder="All facilities"
          style={{ width: '100%' }}
          showSearch
          allowClear
          maxTagCount={2}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </Col>
    </Row>
  );
};

export default Filters;
