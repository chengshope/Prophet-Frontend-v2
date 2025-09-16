import { useGetFacilitiesListQuery } from '@/api/facilitiesApi';
import { Col, DatePicker, Row, Select } from 'antd';

const { RangePicker } = DatePicker;

const Filters = ({ dateRange, onDateRangeChange, facility, onFacilityChange, picker }) => {
  const { data: facilitiesResponse, isLoading: facilitiesLoading } = useGetFacilitiesListQuery();

  const facilities = Array.isArray(facilitiesResponse) ? facilitiesResponse : [];

  const facilityOptions = facilities.map((f) => ({
    label: f.facility_name,
    value: f.facility_id,
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
