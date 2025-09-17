import { useState } from 'react';
import { Row, Space, Col, Input, Button, Modal, message } from 'antd';
import { CloudUploadOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  useGetStreetRatesFacilitiesQuery,
  useSubmitAllRatesMutation,
  useRunPythonModelMutation,
} from '@/api/streetRatesApi';
import StreetRatesTable from './StreetRatesTable';

const { Search } = Input;
const PAGE_SIZE = 10;

const StreetRatesManagement = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('facility_name');
  const [orderby, setOrderby] = useState('asc');
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [changedUnits, setChangedUnits] = useState([]);

  // API queries and mutations
  const {
    data: facilitiesResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetStreetRatesFacilitiesQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    search,
    sort,
    orderby,
    status: 'enabled',
  });

  const [submitAllRates, { isLoading: isSubmitting }] = useSubmitAllRatesMutation();
  const [runPythonModel, { isLoading: isRefreshing }] = useRunPythonModelMutation();

  const data = facilitiesResponse || [];
  const pagination = facilitiesResponse?.pagination || {};

  // Handle search with debouncing
  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle sorting
  const handleSort = (column, direction) => {
    setSort(column);
    setOrderby(direction);
  };

  // Handle pagination
  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  // Handle facility changes (when rates are modified)
  const handleFacilitiesChanged = (facility) => {
    // Update changed units tracking
    const newUnits = facility.units_statistics || [];
    const mergedMap = new Map();
    changedUnits.forEach((unit) => mergedMap.set(unit.ut_id, unit));
    newUnits.forEach((unit) => mergedMap.set(unit.ut_id, unit));
    setChangedUnits(Array.from(mergedMap.values()));
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

  // Handle publish all rates
  const handlePublishNewRates = () => {
    setPublishModalOpen(true);
  };

  const confirmPublishAllRates = async () => {
    try {
      await submitAllRates(changedUnits).unwrap();
      message.success('Rates published successfully');
      setPublishModalOpen(false);
      setChangedUnits([]);
      refetch();
    } catch (error) {
      message.error('Failed to publish rates');
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Header Controls */}
      <Row gutter={[16, 8]} align="middle" justify="space-between">
        <Col xs={24} md={12}>
          <Search
            placeholder="Search or filter..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button
            color="danger"
            variant="filled"
            icon={<ReloadOutlined />}
            loading={isRefreshing}
            onClick={handleRefreshModel}
          >
            Refresh Model
          </Button>
          <Button
            type="primary"
            icon={<CloudUploadOutlined />}
            loading={isSubmitting}
            onClick={handlePublishNewRates}
            disabled={changedUnits.length === 0}
          >
            Publish New Rates
          </Button>
        </Col>
      </Row>

      {/* Street Rates Table */}
      <StreetRatesTable
        data={data}
        loading={isLoading || isFetching}
        sortColumn={sort}
        sortDirection={orderby}
        onSortChanged={handleSort}
        onFacilitiesChanged={handleFacilitiesChanged}
        pagination={{
          current: currentPage,
          total: pagination.total || 0,
          pageSize: PAGE_SIZE,
          onChange: handlePagination,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} facilities`,
        }}
        changedUnits={changedUnits}
        setChangedUnits={setChangedUnits}
      />

      {/* Publish Confirmation Modal */}
      <Modal
        title="Publish New Rates"
        open={publishModalOpen}
        onOk={confirmPublishAllRates}
        onCancel={() => setPublishModalOpen(false)}
        confirmLoading={isSubmitting}
        okText="Publish"
        cancelText="Cancel"
      >
        <p>Are you sure you want to publish the new street rates?</p>
        <p>This will update rates for {changedUnits.length} unit types across all facilities.</p>
      </Modal>
    </Space>
  );
};

export default StreetRatesManagement;
