import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Space, Col, Input, Button, message } from 'antd';
import { CloudUploadOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';

import {
  useGetStreetRatesFacilitiesQuery,
  useSubmitAllRatesMutation,
  useRunPythonModelMutation,
  useLazyExportCSVQuery,
} from '@/api/streetRatesApi';
import { getSavedRateChangedUnits, selectStreetTotal } from '@/features/street/streetSelector';
import { clearSavedRateChanges } from '@/features/street/streetSlice';
import { removeSavedRateUnits } from '@/utils/localStorage';
import { handleCSVExport } from '@/utils/csvExport';
import PageFrame from '@/components/common/PageFrame';
import StreetRatesTable from '@/widget/StreetRates/StreetRatesTable';
import PublishConfirmModal from '@/widget/Modal/PublishConfirmModal';
import ErrorModal from '@/widget/Modal/ErrorModal';
import './StreetRates.less';

const { Search } = Input;

// Constants
const PAGE_SIZE = 10;

const StreetRates = () => {
  // UI State
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('facility_name');
  const [orderby, setOrderby] = useState('asc');
  const [latestPublishedDate, setLatestPublishedDate] = useState('');

  // Modal State
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [modalErrorIsOpen, setModalErrorIsOpen] = useState(false);
  const [errorLog, setErrorLog] = useState('');

  // Redux
  const dispatch = useDispatch();
  const totalFacilities = useSelector(selectStreetTotal);
  const savedRateChangedUnits = useSelector(getSavedRateChangedUnits);

  // API queries and mutations
  const { isLoading, isFetching, refetch } = useGetStreetRatesFacilitiesQuery({
    page: currentPage,
    limit: PAGE_SIZE,
    search,
    sort,
    orderby,
    status: 'enabled',
  });

  const [triggerExportCSV] = useLazyExportCSVQuery();
  const [submitAllRates, { isLoading: isSubmitting }] = useSubmitAllRatesMutation();
  const [runPythonModel, { isLoading: isRefreshing }] = useRunPythonModelMutation();

  // Event Handlers
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

  // Handle refresh model
  const handleRefreshModel = async () => {
    try {
      await runPythonModel().unwrap();
      message.success('Model refreshed successfully');
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  // Handle publish all rates
  const handlePublishNewRates = () => {
    setPublishModalOpen(true);
  };

  const confirmPublishAllRates = async () => {
    try {
      if (savedRateChangedUnits.length === 0) {
        message.warning('No saved rate changes to publish. Please save changes first.');
        setPublishModalOpen(false);
        return;
      }

      // Use only SAVED rate changes for publishing
      await submitAllRates(savedRateChangedUnits).unwrap();
      setLatestPublishedDate(moment(new Date()).format('MM/DD/YYYY, hh:mm A'));
      message.success('Rates published successfully');
      setPublishModalOpen(false);

      // Clear the saved rate changes after successful publishing
      removeSavedRateUnits();
      dispatch(clearSavedRateChanges());
    } catch {
      // handled by RTK
    }
  };

  // CSV Export functionality (matching v1 - uses API endpoint)
  const exportCSV = () => {
    handleCSVExport(
      () => triggerExportCSV().unwrap(),
      'street_rates',
      (msg) => message.success(msg),
      (msg) => message.error(msg)
    );
  };

  // Close error modal
  const closeModalError = () => {
    setModalErrorIsOpen(false);
    setErrorLog('');
  };

  return (
    <PageFrame
      title="Street Rates"
      extra={[
        <Space>
          <Button color="primary" variant="filled" icon={<DownloadOutlined />} onClick={exportCSV}>
            Export CSV
          </Button>
          <Button
            color="danger"
            variant="filled"
            icon={<ReloadOutlined />}
            loading={isRefreshing}
            onClick={handleRefreshModel}
          >
            Refresh Model
          </Button>
        </Space>,
      ]}
    >
      <Space direction="vertical" size="large" className="street-rates-management">
        {/* Header Controls */}
        <Row gutter={[16, 8]} align="middle" justify="space-between">
          <Col xs={24} md={8}>
            <Search
              placeholder="Search or filter..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={12} className="street-rates-header-controls">
            <Button
              color="green"
              variant="solid"
              icon={<CloudUploadOutlined />}
              loading={isSubmitting}
              onClick={handlePublishNewRates}
            >
              Publish New Rates
            </Button>
          </Col>
        </Row>

        {/* Street Rates Table */}
        <StreetRatesTable
          loading={isLoading || isFetching}
          sortColumn={sort}
          sortDirection={orderby}
          onSortChanged={handleSort}
          pagination={{
            current: currentPage,
            total: totalFacilities || 0,
            pageSize: PAGE_SIZE,
            onChange: handlePagination,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} facilities`,
          }}
          latestPublishedDate={latestPublishedDate}
          savedRateChangedUnitsCount={savedRateChangedUnits.length}
        />

        {/* Publish Confirmation Modal */}
        <PublishConfirmModal
          open={publishModalOpen}
          onOk={confirmPublishAllRates}
          onCancel={() => setPublishModalOpen(false)}
          confirmLoading={isSubmitting}
          savedRateChangedUnitsCount={savedRateChangedUnits.length}
        />

        {/* Error Modal */}
        <ErrorModal open={modalErrorIsOpen} onCancel={closeModalError} errorLog={errorLog} />
      </Space>
    </PageFrame>
  );
};

export default StreetRates;
