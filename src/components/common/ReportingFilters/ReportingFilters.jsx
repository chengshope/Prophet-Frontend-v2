import { useGetFacilitiesListQuery } from '@/api/facilitiesApi';
import { Col, DatePicker, Row, Select } from 'antd';
import { useMemo } from 'react';

const { RangePicker } = DatePicker;

const ReportingFilters = ({
  dateRange,
  onDateRangeChange,
  facility,
  onFacilityChange,
  picker = 'date',
  loading = false,
  dateFormat,
  placeholder = 'All facilities',
  maxTagCount = 2,
  size = 'middle',
  style,
  className,
}) => {
  const { data: facilitiesResponse, isLoading: facilitiesLoading } = useGetFacilitiesListQuery();

  const facilities = Array.isArray(facilitiesResponse) ? facilitiesResponse : [];

  const facilityOptions = useMemo(
    () =>
      facilities.map((f) => ({
        label: f.facility_name,
        value: f.facility_id,
        key: f.facility_id,
      })),
    [facilities]
  );

  return (
    <div className={className} style={style}>
      <Row gutter={[16, 8]} align="middle" justify="space-between">
        <Col xs={24} sm={12} md={8} lg={8}>
          <RangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            allowClear={false}
            picker={picker}
            format={dateFormat}
            size={size}
            style={{ width: '100%' }}
            disabled={loading}
            placeholder={
              picker === 'month'
                ? ['Start Month', 'End Month']
                : picker === 'year'
                  ? ['Start Year', 'End Year']
                  : ['Start Date', 'End Date']
            }
          />
        </Col>
        <Col xs={24} sm={12} md={16} lg={8}>
          <Select
            mode="multiple"
            value={facility}
            onChange={onFacilityChange}
            loading={facilitiesLoading}
            options={facilityOptions}
            placeholder={placeholder}
            style={{ width: '100%' }}
            size={size}
            showSearch
            allowClear
            maxTagCount={maxTagCount}
            disabled={loading}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            styles={{ popup: { root: { maxHeight: 300 } } }}
            notFoundContent={facilitiesLoading ? 'Loading...' : 'No facilities found'}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ReportingFilters;
