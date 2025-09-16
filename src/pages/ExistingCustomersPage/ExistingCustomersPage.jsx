import PageFrame from '@/components/common/PageFrame';
import { CloudUploadOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Space, Table, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import './ExistingCustomersPage.less';

const { Text } = Typography;
const { Search } = Input;

const ExistingCustomersPage = () => {
  const [search, setSearch] = useState('');
  const [data] = useState([]);

  const columns = useMemo(
    () => [
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
          <Text>
            {r.city}
            {r.city && r.state ? ', ' : ''}
            {r.state}
          </Text>
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
        sorter: (a, b) =>
          (a.est_revenue_increase_percent || 0) - (b.est_revenue_increase_percent || 0),
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
    ],
    []
  );

  return (
    <PageFrame
      title="Existing Customers"
      extra={[
        <Button color="danger" variant="filled" icon={<ReloadOutlined />}>
          Refresh Model
        </Button>,
      ]}
    >
      <Space direction="vertical" size="large" className="page">
        <Row gutter={[16, 8]} align="middle" justify="space-between">
          <Col xs={24} md={12}>
            <Search
              placeholder="Search or filter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col xs={24} md={12} className="actions-col">
            <Button color="green" variant="solid" icon={<CloudUploadOutlined />}>
              Publish New Rates
            </Button>
          </Col>
        </Row>

        <Table
          size="small"
          bordered
          rowKey={(r) => r.id || `${r.facility_id}`}
          columns={columns}
          dataSource={data}
          locale={{
            emptyText: (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '40px 20px',
                  color: '#8c8c8c',
                }}
              >
                <UserOutlined
                  style={{ fontSize: '48px', marginBottom: '16px', color: '#d9d9d9' }}
                />
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    marginBottom: '8px',
                    color: '#595959',
                  }}
                >
                  No Customer Data
                </div>
                <div style={{ fontSize: '14px', textAlign: 'center', lineHeight: '1.5' }}>
                  Existing customer information will appear here when available.
                  <br />
                  Check your facility selection or refresh the data.
                </div>
              </div>
            ),
          }}
          pagination={{ pageSize: 10 }}
        />
      </Space>
    </PageFrame>
  );
};

export default ExistingCustomersPage;
