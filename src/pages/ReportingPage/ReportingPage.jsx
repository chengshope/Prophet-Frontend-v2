import {
  Card,
  Col,
  DatePicker,
  Empty,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const Filters = ({ dateRange, onDateRangeChange, facility, onFacilityChange, picker }) => (
  <Card size="small">
    <Row gutter={[16, 16]} align="middle">
      <Col xs={24} sm={12} md={8} lg={6}>
        <Space direction="vertical" size="small">
          <Text strong>Date Range</Text>
          <RangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            allowClear={false}
            picker={picker}
          />
        </Space>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Space direction="vertical" size="small">
          <Text strong>Facility</Text>
          <Select
            value={facility}
            onChange={onFacilityChange}
            options={[
              { label: 'All Facilities', value: 'all' },
              { label: 'Facility A', value: 'a' },
              { label: 'Facility B', value: 'b' },
            ]}
          />
        </Space>
      </Col>
    </Row>
  </Card>
);

const ExecutiveSummaryTab = () => {
  const [range, setRange] = useState();
  const [facility, setFacility] = useState('all');
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Filters
        dateRange={range}
        onDateRangeChange={setRange}
        facility={facility}
        onFacilityChange={setFacility}
      />
      <Row gutter={[16, 16]}>
        {[
          { title: 'Gross Rental Revenue', value: '$0.00M' },
          { title: 'Gross Potential Revenue', value: '$0.00M' },
          { title: 'Occupancy', value: '0%' },
          { title: 'RevPAF', value: '$0.00' },
        ].map((m) => (
          <Col xs={24} sm={12} lg={6} key={m.title}>
            <Card>
              <Statistic title={m.title} value={m.value} />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Revenue Over Time">
            <Empty description="Chart coming soon" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Occupancy Over Time">
            <Empty description="Chart coming soon" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Gross Potential Revenue Over Time">
            <Empty description="Chart coming soon" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="RevPAF Over Time">
            <Empty description="Chart coming soon" />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

const StreetRatesTab = () => {
  const [range, setRange] = useState();
  const [facility, setFacility] = useState('all');
  const columns = [
    { title: 'Date', dataIndex: 'date' },
    { title: 'Occupancy', dataIndex: 'occupancy' },
    { title: 'Avg Rate', dataIndex: 'avgRate', responsive: ['md'] },
  ];
  const data = [];
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Filters
        dateRange={range}
        onDateRangeChange={setRange}
        facility={facility}
        onFacilityChange={setFacility}
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Occupancy by Date">
            <Empty description="Chart coming soon" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Occupancy by Facilities">
            <Empty description="Chart coming soon" />
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <Table columns={columns} dataSource={data} pagination={false} size="middle" />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

const ExistingRatesTab = () => {
  const [range, setRange] = useState();
  const [facility, setFacility] = useState('all');
  const columns = [
    { title: 'Month', dataIndex: 'month' },
    { title: 'Total Increases', dataIndex: 'totalIncreases' },
    { title: 'Occupied Units', dataIndex: 'totalOccupiedUnits' },
    { title: 'ECRI %', dataIndex: 'ecriPercentage' },
    { title: 'Revenue Increase', dataIndex: 'totalRevenueIncrease' },
  ];
  const data = [];
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Filters
        dateRange={range}
        onDateRangeChange={setRange}
        facility={facility}
        onFacilityChange={setFacility}
        picker="month"
      />
      <Card>
        <Table columns={columns} dataSource={data} pagination={false} size="middle" />
      </Card>
    </Space>
  );
};

const tabItems = [
  {
    key: 'executive-summary',
    label: 'Executive Summary',
    children: <ExecutiveSummaryTab />,
    path: '/reporting/executive-summary',
  },
  {
    key: 'street-rates',
    label: 'Street Rates',
    children: <StreetRatesTab />,
    path: '/reporting/street-rates',
  },
  {
    key: 'existing-rates',
    label: 'Existing Rates',
    children: <ExistingRatesTab />,
    path: '/reporting/existing-rates',
  },
];

const ReportingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('executive-summary');

  const handleTabChange = (key) => {
    const tab = tabItems.find((t) => t.key === key);
    if (tab) {
      setActiveTab(key);
      navigate(tab.path);
    }
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const currentKey =
      tabItems.find((t) => currentPath.startsWith(t.path))?.key || 'executive-summary';
    setActiveTab(currentKey);
  }, [location.pathname]);

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={4}>Reporting</Title>
        <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} size="large" />
      </Space>
    </Card>
  );
};

export default ReportingPage;
