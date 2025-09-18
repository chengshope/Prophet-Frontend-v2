import { useState } from 'react';
import { Row, Space, Col, Input, Button, Modal, message } from 'antd';
import { CloudUploadOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  useGetExistingCustomersQuery,
  usePublishAllRateChangesMutation,
  useRefreshModelMutation,
} from '@/api/existingCustomersApi';
import ExistingCustomersTable from './ExistingCustomersTable/ExistingCustomersTable';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { removeSavedTenantChanges } from '../../../utils/localStorage';
import {
  selectExistingCustomersFacilities,
  selectExistingCustomersTotal,
  getSavedEcriIds,
  getFacilitiesWithChangesCount,
} from '@/features/existingCustomers/existingCustomersSelector';
import { clearSavedTenantChanges } from '@/features/existingCustomers/existingCustomersSlice';

const { Search } = Input;
const PAGE_SIZE = 10;

const ExistingCustomers = () => {
  // internal ui state
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('facility_name');
  const [orderby, setOrderby] = useState('asc');
  const [latestPublishedDate, setLatestPublishedDate] = useState('');
  // modal state
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [errorLog, setErrorLog] = useState('');
  const [modalErrorIsOpen, setModalErrorIsOpen] = useState(false);

  const dispatch = useDispatch();

  // Redux selectors
  const facilities = useSelector(selectExistingCustomersFacilities);
  const totalFacilities = useSelector(selectExistingCustomersTotal);
  const savedEcriIds = useSelector(getSavedEcriIds);
  const facilitiesWithChangesCount = useSelector(getFacilitiesWithChangesCount);

  // API hooks
  const { isLoading, isFetching, refetch } = useGetExistingCustomersQuery({
    page: currentPage,
    search,
    sort,
    orderby,
    limit: PAGE_SIZE,
  });

  const [publishAllRateChanges, { isLoading: isPublishing }] = usePublishAllRateChangesMutation();
  const [refreshModel, { isLoading: isRefreshingModel }] = useRefreshModelMutation();

  // Handle search
  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (field, direction) => {
    setSort(field);
    setOrderby(direction);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle publish all rates (using Redux state)
  const handlePublishNewRates = () => {
    if (savedEcriIds.length === 0) {
      message.warning('No saved changes to publish. Please save changes first.');
      return;
    }
    setPublishModalOpen(true);
  };

  const confirmPublishAllRates = async () => {
    try {
      await publishAllRateChanges(savedEcriIds).unwrap();
      setLatestPublishedDate(moment(new Date()).format('MM/DD/YYYY, hh:mm A'));
      message.success('Rate changes published successfully');
      setPublishModalOpen(false);

      // Clear saved changes from Redux and localStorage
      dispatch(clearSavedTenantChanges());
      removeSavedTenantChanges();

      refetch();
    } catch (error) {
      console.error('Error publishing rates:', error);
      setErrorLog(error?.data?.message || 'Failed to publish rate changes');
      setModalErrorIsOpen(true);
      setPublishModalOpen(false);
    }
  };

  // Handle refresh model (matching v1 functionality)
  const handleRefreshModel = async () => {
    try {
      await refreshModel().unwrap();
      message.success('Model refreshed successfully');
      // Navigate to loading page like v1 does
      window.location.href = '/loading?redirect=existing-customer-rate-increases';
    } catch (error) {
      console.error('Error refreshing model:', error);
      message.error('Failed to refresh model');
    }
  };

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
        <Col xs={24} md={12}>
          <Search
            placeholder="Search facilities..."
            allowClear
            onSearch={handleSearch}
            style={{ width: '100%', maxWidth: '400px' }}
          />
        </Col>
        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefreshModel}
              loading={isRefreshingModel}
            >
              Refresh Model
            </Button>
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={handlePublishNewRates}
              loading={isPublishing}
            >
              Publish New Rates
            </Button>
          </Space>
        </Col>
      </Row>

      <Row justify="space-between" style={{ padding: '0 8px', fontSize: '14px', color: '#8c8c8c' }}>
        <Col>{latestPublishedDate && `Last Updated: ${latestPublishedDate}`}</Col>
        <Col>
          {facilitiesWithChangesCount > 0 &&
            `${facilitiesWithChangesCount} ${facilitiesWithChangesCount === 1 ? 'Facility' : 'Facilities'} Edited`}
          {savedEcriIds.length > 0 && ` | ${savedEcriIds.length} Saved Changes Ready to Publish`}
        </Col>
      </Row>

      <ExistingCustomersTable
        loading={isLoading || isFetching}
        sortColumn={sort}
        sortDirection={orderby}
        onSortChanged={handleSort}
        pagination={{
          current: currentPage,
          total: totalFacilities,
          pageSize: PAGE_SIZE,
          onChange: handlePageChange,
        }}
      />

      {/* Publish All Modal */}
      <Modal
        title="Publish All Rate Changes"
        open={publishModalOpen}
        onOk={confirmPublishAllRates}
        onCancel={() => setPublishModalOpen(false)}
        confirmLoading={isPublishing}
      >
        <p>Are you sure you want to publish all saved rate changes?</p>
        <p>
          <strong>{savedEcriIds.length}</strong> saved changes will be published across{' '}
          <strong>{facilitiesWithChangesCount}</strong> facilities.
        </p>
      </Modal>

      {/* Error Modal */}
      <Modal
        title="Error"
        open={modalErrorIsOpen}
        onOk={() => setModalErrorIsOpen(false)}
        onCancel={() => setModalErrorIsOpen(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setModalErrorIsOpen(false)}>
            OK
          </Button>,
        ]}
      >
        <p>{errorLog}</p>
      </Modal>
    </>
  );
};

export default ExistingCustomers;
