import { Button, Card, Col, Input, Row, Space, Table, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';

const { Title, Text } = Typography;
const { Search } = Input;

const ExistingCustomersPage = () => {
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
      title: 'Market',
      dataIndex: 'market',
      key: 'market',
      sorter: (a, b) => (a.market || '').localeCompare(b.market || ''),
      render: (_, r) => (
        <Text>{r.city}{r.city && r.state ? ', ' : ''}{r.state}</Text>
      ),
    },
    {
      title: 'Total Eligible Tenants',
      dataIndex: 'tenants_total',
      key: 'tenants_total',
      align: 'right',
      sorter: (a, b) => (a.tenants_total || 0) - (b.tenants_total || 0),
    },
    {
      title: 'Avg Rate Increase %',
      dataIndex: 'avg_rate_increase_percent',
      key: 'avg_rate_increase_percent',
      align: 'right',
      sorter: (a, b) => (a.avg_rate_increase_percent || 0) - (b.avg_rate_increase_percent || 0),
      render: (v) => (v != null ? `${v}%` : ''),
    },
    {
      title: 'Est Revenue Increase %',
      dataIndex: 'est_revenue_increase_percent',
      key: 'est_revenue_increase_percent',
      align: 'right',
      sorter: (a, b) => (a.est_revenue_increase_percent || 0) - (b.est_revenue_increase_percent || 0),
      render: (v) => (v != null ? `${v}%` : ''),
    },
    {
      title: 'Avg Move-out Probability',
      dataIndex: 'avg_moveout_probability',
      key: 'avg_moveout_probability',
      align: 'right',
      sorter: (a, b) => (a.avg_moveout_probability || 0) - (b.avg_moveout_probability || 0),
      render: (v) => {
        if (v == null) return null;
        let color = 'green';
        if (v >= 15) color = 'volcano';
        else if (v >= 8) color = 'gold';
        return <Tag color={color}>{v}%</Tag>;
      },
    },
  ], []);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>Existing Customers</Title>

      <Card>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={12}>
            <Search placeholder="Search or filter..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </Col>
          <Col xs={24} md={12}>
            <Space style={{ width: '100%' }} align="center" justify="end">
              <Button>Refresh Model</Button>
              <Button type="primary">Publish All</Button>
            </Space>
          </Col>
        </Row>
        <Row style={{ marginTop: 8 }}>
          <Col flex="auto">
            <Text type="secondary">Last Updated: —</Text>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          rowKey={(r) => r.id || `${r.facility_id}`}
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </Space>
  );
};

export default ExistingCustomersPage;
