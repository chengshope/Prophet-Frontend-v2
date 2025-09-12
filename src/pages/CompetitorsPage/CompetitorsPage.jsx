import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;
const { Search } = Input;

const STRATEGY_OPTIONS = [
  { label: 'Mirror Competitors', value: 'mirror' },
  { label: 'Maverick', value: 'maverick' },
  { label: 'Happy Medium', value: 'happy_medium' },
  { label: 'Maverick+', value: 'maverick_plus' },
];

const competitorTypeOptions = [
  { label: 'Direct', value: 'Direct' },
  { label: 'Indirect', value: 'Indirect' },
  { label: 'Non-competitor', value: 'Non-competitor' },
];

const CompetitorsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedFacility, setSelectedFacility] = useState(id || undefined);
  const [strategy, setStrategy] = useState();
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);

  const facilityOptions = useMemo(
    () => [
      { label: 'Facility A', value: '1' },
      { label: 'Facility B', value: '2' },
    ],
    []
  );

  const strategyLabels = useMemo(() => STRATEGY_OPTIONS.map((s) => s.label), []);

  const columns = [
    {
      title: '',
      dataIndex: 'comp_type',
      key: 'warning',
      width: 40,
      render: (val) => (!val ? <Tag color="red">!</Tag> : null),
    },
    {
      title: 'Competitor',
      dataIndex: 'store_name',
      key: 'store_name',
      sorter: (a, b) => (a.store_name || '').localeCompare(b.store_name || ''),
      render: (_, record) => (
        <a href={record.source_url} target="_blank" rel="noreferrer">
          {record.store_name} {record.address}
        </a>
      ),
    },
    {
      title: 'Distance',
      dataIndex: 'distance',
      key: 'distance',
      sorter: (a, b) => (parseFloat(a.distance) || 0) - (parseFloat(b.distance) || 0),
    },
    {
      title: 'Type',
      dataIndex: 'comp_type',
      key: 'comp_type',
      render: (value, record) => (
        <Select
          size="small"
          value={value}
          placeholder="Select..."
          style={{ width: 160 }}
          options={competitorTypeOptions}
          onChange={(val) => {
            setData((prev) =>
              prev.map((row) => (row.id === record.id ? { ...row, comp_type: val } : row))
            );
          }}
        />
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>Competitors</Title>

      <Card>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Facility</Text>
              <Select
                showSearch
                allowClear
                placeholder="Select Facility"
                options={facilityOptions}
                value={selectedFacility}
                onChange={(val) => setSelectedFacility(val)}
              />
            </Space>
          </Col>
          <Col xs={24} md={10}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Strategy</Text>
              <Radio.Group value={strategy} onChange={(e) => setStrategy(e.target.value)}>
                {strategyLabels.map((label) => (
                  <Radio.Button key={label} value={label}>
                    {label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Space>
          </Col>
          <Col xs={24} md={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Search</Text>
              <Search
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Space>
          </Col>
        </Row>
        <Row justify="end" style={{ marginTop: 16 }}>
          <Col>
            <Button onClick={() => navigate('/street-rates')}>Back to Street Rates</Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <Table
              rowKey="id"
              size="middle"
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Map">
            <Empty description="Map will appear here" />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default CompetitorsPage;
