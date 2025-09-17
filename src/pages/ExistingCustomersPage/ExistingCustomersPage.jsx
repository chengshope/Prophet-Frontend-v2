import PageFrame from '@/components/common/PageFrame';
import { CloudUploadOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Space, Table, Tag, Typography, message } from 'antd';
import { useMemo, useState } from 'react';
import {
  useGetExistingCustomersQuery,
  useGetExistingCustomersSummaryQuery,
  usePublishAllRateChangesMutation,
  useRunPythonModelMutation,
} from '@/api/existingCustomersApi';
import { getChangedEcriIDs, removeChangedEcriIDs } from '../../utils/localStorage';
import { getMoveOutProbabilityColor } from '../../utils/config';
import './ExistingCustomersPage.less';

const { Text } = Typography;
const { Search } = Input;

const ExistingCustomersPage = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('facility_name');
  const [orderby, setOrderby] = useState('asc');

  // API hooks
  const { data, isLoading, refetch } = useGetExistingCustomersQuery({
    page: currentPage,
    search,
    sort,
    orderby,
  });

  const { data: summaryData } = useGetExistingCustomersSummaryQuery();
  const [publishAllRateChanges, { isLoading: isPublishing }] = usePublishAllRateChangesMutation();
  const [runPythonModel, { isLoading: isRunningModel }] = useRunPythonModelMutation();

  // Handle publish all rates
  const handlePublishAllRates = async () => {
    try {
      const changedIds = getChangedEcriIDs();
      if (changedIds.length === 0) {
        message.warning('No changes to publish');
        return;
      }
      await publishAllRateChanges(changedIds).unwrap();
      message.success('Rate changes published successfully');
      removeChangedEcriIDs();
      refetch();
    } catch (error) {
      console.error('Error publishing rates:', error);
      message.error('Failed to publish rate changes');
    }
  };

  // Handle refresh model
  const handleRefreshModel = async () => {
    try {
      await runPythonModel().unwrap();
      message.success('Model refreshed successfully');
      refetch();
    } catch (error) {
      message.error('Failed to refresh model');
    }
  };

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
        dataIndex: 'tenant_total',
        key: 'tenant_total',
        align: 'right',
        sorter: (a, b) => (a.tenant_total || 0) - (b.tenant_total || 0),
      },
      {
        title: 'Avg Rate Increase %',
        dataIndex: 'avr_rate_increase_percent',
        key: 'avr_rate_increase_percent',
        align: 'right',
        sorter: (a, b) => (a.avr_rate_increase_percent || 0) - (b.avr_rate_increase_percent || 0),
        render: (v) => (v != null ? `${v.toFixed(1)}%` : ''),
      },
      {
        title: 'Est Revenue Increase',
        dataIndex: 'estimated_revenue_increase',
        key: 'estimated_revenue_increase',
        align: 'right',
        sorter: (a, b) => (a.estimated_revenue_increase || 0) - (b.estimated_revenue_increase || 0),
        render: (v) => (v != null ? `$${v.toLocaleString()}` : ''),
      },
      {
        title: 'Avg Move-out Probability',
        dataIndex: 'avr_moveout_probability',
        key: 'avr_moveout_probability',
        align: 'right',
        sorter: (a, b) => (a.avr_moveout_probability || 0) - (b.avr_moveout_probability || 0),
        render: (v) => {
          if (v == null) return null;
          const percentage = v * 100;
          const color = getMoveOutProbabilityColor(percentage);
          return <Tag color={color}>{percentage.toFixed(1)}%</Tag>;
        },
      },
    ],
    []
  );

  return (
    <PageFrame
      title="Existing Customers"
      extra={[
        <Button
          key="refresh"
          color="danger"
          variant="filled"
          icon={<ReloadOutlined />}
          loading={isRunningModel}
          onClick={handleRefreshModel}
        >
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
            <Button
              color="green"
              variant="solid"
              icon={<CloudUploadOutlined />}
              loading={isPublishing}
              onClick={handlePublishAllRates}
            >
              Publish New Rates
            </Button>
          </Col>
        </Row>

        <Table
          size="small"
          bordered
          rowKey={(r) => r.facility_id}
          columns={columns}
          dataSource={data?.data || []}
          loading={isLoading}
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
          pagination={{
            pageSize: 10,
            current: currentPage,
            total: data?.pagination?.total || 0,
            onChange: setCurrentPage,
          }}
        />
      </Space>
    </PageFrame>
  );
};

export default ExistingCustomersPage;
