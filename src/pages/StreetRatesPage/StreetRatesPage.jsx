import { Button, Card, Col, Input, Row, Space, Table, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';

const { Title, Text } = Typography;
const { Search } = Input;

const StreetRatesPage = () => {
  const [search, setSearch] = useState('');
  const [data] = useState([]);

  const columns = useMemo(() => [
    {
      title: 'Facility',
      dataIndex: 'facility_name',
      key: 'facility_name',
      sorter: (a, b) => (a.facility_name || '').localeCompare(b.facility_name || ''),
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Text strong>{r.facility_name}</Text>
          <Text type="secondary">{r.address}</Text>
        </Space>
      ),
    },
    {
      title: 'Physical Occupancy %',
      dataIndex: 'physical_occupancy',
      key: 'physical_occupancy',
      align: 'right',
      sorter: (a, b) => (a.physical_occupancy || 0) - (b.physical_occupancy || 0),
      render: (v) => (v != null ? `${parseFloat(v).toFixed(2)}%` : ''),
    },
    {
      title: 'Available Units',
      dataIndex: 'available_units',
      key: 'available_units',
      align: 'right',
      sorter: (a, b) => (a.available_units || 0) - (b.available_units || 0),
    },
    {
      title: 'Current Rate',
      dataIndex: 'current_rate',
      key: 'current_rate',
      align: 'right',
      sorter: (a, b) => (a.current_rate || 0) - (b.current_rate || 0),
      render: (v) => (v != null ? `$${v}` : ''),
    },
    {
      title: 'Recommended Rate',
      dataIndex: 'recommended_rate',
      key: 'recommended_rate',
      align: 'right',
      sorter: (a, b) => (a.recommended_rate || 0) - (b.recommended_rate || 0),
      render: (v) => (v != null ? `$${v}` : ''),
    },
    {
      title: 'Diff $',
      dataIndex: 'difference_amount',
      key: 'difference_amount',
      align: 'right',
      sorter: (a, b) => (a.difference_amount || 0) - (b.difference_amount || 0),
      render: (v) => (v != null ? <Tag color={v >= 0 ? 'green' : 'volcano'}>{v >= 0 ? '+' : ''}${v}</Tag> : ''),
    },
    {
      title: 'Diff %',
      dataIndex: 'difference_percent',
      key: 'difference_percent',
      align: 'right',
      sorter: (a, b) => (a.difference_percent || 0) - (b.difference_percent || 0),
      render: (v) => (v != null ? `${v}%` : ''),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button>Unit Mix Detail</Button>
          <Button type="primary">Publish Rates</Button>
        </Space>
      ),
    },
  ], []);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>Street Rates</Title>

      <Card>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={12}>
            <Search placeholder="Search or filter..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </Col>
          <Col xs={24} md={12}>
            <Space style={{ width: '100%' }} align="center" justify="end">
              <Button>Refresh Model</Button>
              <Button type="primary">Publish New Rates</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          rowKey={(r) => r.id || `${r.facility_id}`}
          columns={columns}
          dataSource={data}
          expandable={{
            expandedRowRender: () => (
              <Card size="small"><Text type="secondary">Unit types and rate editor coming soon</Text></Card>
            ),
          }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </Space>
  );
};

export default StreetRatesPage;
