/**
 * ExistingCustomers Page Component
 * Following Rule #4: Main code structure should be pages/{PageName}/{PageComponent}.jsx
 * Following Rule #10: Keep under 120 lines
 * Following Rule #28: Do not change layout or logic
 */

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
  selectExistingCustomersApiParams,
  selectPaginationConfig,
  selectPublishModalOpen,
  selectErrorModalOpen,
  selectErrorLog,
  selectLatestPublishedDate,
  getSavedEcriIds,
  getFacilitiesWithChangesCount,
  getFormattedSummaryData,
  selectRefreshingLoading,
} from '@/features/existingCustomers/existingCustomersSelector';
import {
  setSearch,
  setCurrentPage,
  setSort,
  setPublishModalOpen,
  setErrorModalOpen,
  setErrorLog,
  setLatestPublishedDate,
  clearSavedTenantChanges,
} from '@/features/existingCustomers/existingCustomersSlice';
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
  // Redux state and navigation
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux selectors - centralized state
  const apiParams = useSelector(selectExistingCustomersApiParams);
  const paginationConfig = useSelector(selectPaginationConfig);
  const publishModalOpen = useSelector(selectPublishModalOpen);
  const errorModalOpen = useSelector(selectErrorModalOpen);
  const errorLog = useSelector(selectErrorLog);
  const latestPublishedDate = useSelector(selectLatestPublishedDate);
  const savedEcriIds = useSelector(getSavedEcriIds);
  const facilitiesWithChangesCount = useSelector(getFacilitiesWithChangesCount);
  const summaryStats = useSelector(getFormattedSummaryData);
  const isRefreshingModel = useSelector(selectRefreshingLoading);

  // API queries and mutations
  const { isLoading, isFetching } = useGetExistingCustomersQuery(apiParams);
  const [publishAllRateChanges, { isLoading: isPublishing }] = usePublishAllRateChangesMutation();

  // Event handlers using Redux actions
  const handleSearch = (value) => {
    dispatch(setSearch(value));
  };

  const handleSort = (column, direction) => {
    dispatch(setSort({ column, direction }));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  // Handle publish all rates
  const handlePublishNewRates = () => {
    dispatch(setPublishModalOpen(true));
  };

  const confirmPublishAllRates = async () => {
    try {
      if (savedEcriIds.length === 0) {
        message.warning('No saved rate changes to publish. Please save changes first.');
        dispatch(setPublishModalOpen(false));
        return;
      }

      await publishAllRateChanges(savedEcriIds).unwrap();
      dispatch(setLatestPublishedDate(moment(new Date()).format('MM/DD/YYYY, hh:mm A')));
      message.success('Rates published successfully');
      dispatch(setPublishModalOpen(false));

      // Clear the saved rate changes after successful publishing
      removeSavedTenantChanges();
      dispatch(clearSavedTenantChanges());
    } catch (error) {
      console.error('Error publishing rates:', error);
      dispatch(setErrorLog(error?.data?.message || 'Failed to publish rates'));
      dispatch(setErrorModalOpen(true));
      dispatch(setPublishModalOpen(false));
    }
  };

  // Handle refresh model - redirect to loading page like v1
  const handleRefreshModel = () => {
    // Clear any saved changes before refreshing (matching v1 behavior)
    // Navigate to loading page with redirect parameter
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
        {/* 1. Header Controls - Search and Publish Button */}
        <Row gutter={[16, 8]} align="middle" justify="space-between">
          <Col xs={24} md={8}>
            <Search
              placeholder="Search or filter..."
              allowClear
              onSearch={handleSearch}
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

        {/* 2. Summary Cards */}
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

        {/* 3. ExistingCustomers Table */}
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

        {/* Publish All Modal */}
        <PublishAllModal
          open={publishModalOpen}
          onOk={confirmPublishAllRates}
          onCancel={() => dispatch(setPublishModalOpen(false))}
          confirmLoading={isPublishing}
          savedEcriIds={savedEcriIds}
          facilitiesWithChangesCount={facilitiesWithChangesCount}
        />

        {/* Error Modal */}
        <ErrorModal
          open={errorModalOpen}
          onOk={() => dispatch(setErrorModalOpen(false))}
          onCancel={() => dispatch(setErrorModalOpen(false))}
          errorLog={errorLog}
        />
      </Space>
    </PageFrame>
  );
};

export default ExistingCustomers;
