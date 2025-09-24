import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Input, Button, message, Card, Typography, Space } from 'antd';
import { UserOutlined, ReloadOutlined, CloudUploadOutlined } from '@ant-design/icons';
import moment from 'moment';

import {
  useGetExistingCustomersQuery,
  usePublishAllRateChangesMutation,
} from '@/api/existingCustomersApi';
import {
  getSavedEcriIds,
  getFacilitiesWithChangesCount,
  getFormattedSummaryData,
} from '@/features/existingCustomers/existingCustomersSelector';
import { clearSavedTenantChanges } from '@/features/existingCustomers/existingCustomersSlice';
import { removeSavedTenantChanges } from '@/utils/localStorage';
import PageFrame from '@/components/common/PageFrame';
import {
  ExistingCustomersTable,
  PublishAllModal,
  ErrorModal,
} from '@/components/widgets/ExistingCustomers';
import './ExistingCustomers.less';

const { Search } = Input;
const { Text } = Typography;

const ExistingCustomers = () => {
  // Local state management (Rule #29: Use useState for local state)
  const [searchInput, setSearchInput] = useState(''); // User input
  const [search, setSearchState] = useState(''); // Debounced search value
  const [sort, setSortState] = useState('facility_name');
  const [orderby, setOrderByState] = useState('asc');
  const [currentPage, setCurrentPageState] = useState(1);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorLog, setErrorLog] = useState('');
  const [latestPublishedDate, setLatestPublishedDate] = useState('');

  // Redux state for API responses (Rule #29: Use redux for api responses)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const savedEcriIds = useSelector(getSavedEcriIds);
  const facilitiesWithChangesCount = useSelector(getFacilitiesWithChangesCount);
  const summaryStats = useSelector(getFormattedSummaryData);

  useEffect(() => {
    if (searchInput.trim() === '') {
      setSearchState('');
      setCurrentPageState(1);
      return;
    }

    const timeoutId = setTimeout(() => {
      setSearchState(searchInput);
      setCurrentPageState(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const apiParams = useMemo(() => {
    const params = {
      status: 'enabled',
      sort,
      orderby,
      page: currentPage,
      limit: 10,
    };

    if (search && search.trim()) {
      params.search = search.trim();
    }

    return params;
  }, [search, sort, orderby, currentPage]);

  const paginationConfig = useMemo(
    () => ({
      current: currentPage,
      pageSize: 10,
      showSizeChanger: false,
      showQuickJumper: true,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} facilities`,
    }),
    [currentPage]
  );

  const { isLoading, isFetching } = useGetExistingCustomersQuery(apiParams, {
    refetchOnMountOrArgChange: true,
  });
  const [publishAllRateChanges, { isLoading: isPublishing }] = usePublishAllRateChangesMutation();

  const handleSearch = (value) => {
    setSearchInput(value);
  };

  const handleSort = (column, direction) => {
    setSortState(column);
    setOrderByState(direction);
  };

  const handlePageChange = (page) => {
    setCurrentPageState(page);
  };

  const handlePublishNewRates = () => {
    setPublishModalOpen(true);
  };

  const confirmPublishAllRates = async () => {
    try {
      if (savedEcriIds.length === 0) {
        message.warning('No saved rate changes to publish. Please save changes first.');
        setPublishModalOpen(false);
        return;
      }

      await publishAllRateChanges(savedEcriIds).unwrap();
      setLatestPublishedDate(moment(new Date()).format('MM/DD/YYYY, hh:mm A'));
      message.success('Rates published successfully');
      setPublishModalOpen(false);

      // Clear the saved rate changes after successful publishing
      removeSavedTenantChanges();
      dispatch(clearSavedTenantChanges());
    } catch (error) {
      console.error('Error publishing rates:', error);
      setErrorLog(error?.data?.message || 'Failed to publish rates');
      setErrorModalOpen(true);
      setPublishModalOpen(false);
    }
  };

  const handleRefreshModel = () => {
    navigate('/loading?redirect=existing-customer-rate-increases');
  };

  return (
    <PageFrame
      title="Existing Customers"
      icon={<UserOutlined />}
      extra={[
        <Button
          key="refresh"
          color="danger"
          variant="filled"
          icon={<ReloadOutlined />}
          loading={false}
          onClick={handleRefreshModel}
        >
          Refresh Model
        </Button>,
      ]}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Row gutter={[16, 8]} align="middle" justify="space-between">
          <Col xs={24} md={8}>
            <Search
              placeholder="Search or filter..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={12} className="existing-customers-header-controls">
            <Button
              color="green"
              variant="solid"
              icon={<CloudUploadOutlined />}
              loading={isPublishing}
              onClick={handlePublishNewRates}
            >
              Publish New Rates
            </Button>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Text type="secondary">Total Eligible Tenants</Text>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {summaryStats?.totalTenants || 0}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Text type="secondary">Average Rate Increase %</Text>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {summaryStats?.averageRateIncrease || '0.0'}%
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Text type="secondary">Estimated Revenue Increase</Text>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                ${summaryStats?.estimatedRevenueIncrease || '0.00'}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Text type="secondary">Average Move-out Probability</Text>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
                {summaryStats?.averageMoveOutProbability || '0.0'}%
              </div>
            </Card>
          </Col>
        </Row>

        <ExistingCustomersTable
          loading={isLoading || isFetching}
          onSortChanged={handleSort}
          pagination={{
            ...paginationConfig,
            onChange: handlePageChange,
          }}
          latestPublishedDate={latestPublishedDate}
          savedChangesCount={savedEcriIds.length}
        />

        <PublishAllModal
          open={publishModalOpen}
          onOk={confirmPublishAllRates}
          onCancel={() => setPublishModalOpen(false)}
          confirmLoading={isPublishing}
          savedEcriIds={savedEcriIds}
          facilitiesWithChangesCount={facilitiesWithChangesCount}
        />

        <ErrorModal
          open={errorModalOpen}
          onOk={() => setErrorModalOpen(false)}
          onCancel={() => setErrorModalOpen(false)}
          errorLog={errorLog}
        />
      </Space>
    </PageFrame>
  );
};

export default ExistingCustomers;
