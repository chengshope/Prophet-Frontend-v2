/**
 * StreetRates Page Component
 * Following Rule #4: Main code structure should be pages/{PageName}/{PageComponent}.jsx
 * Following Rule #10: Keep under 120 lines
 * Following Rule #28: Do not change layout or logic
 */

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
import { selectSavedRateUnits, selectStreetTotal } from '@/features/street/streetSelector';
import { clearSavedRateChanges } from '@/features/street/streetSlice';
import { removeSavedRateUnits } from '@/utils/localStorage';
import { handleCSVExport } from '@/utils/csvExport';
import {
  selectStreetRatesApiParams,
  selectSearch,
  selectSort,
  selectOrderBy,
  selectPublishModalOpen,
  selectErrorModalOpen,
  selectErrorLog,
  selectLatestPublishedDate,
  selectPaginationConfig,
} from '@/features/streetRate/streetRateSelector';
import {
  setSearch,
  setSort,
  setCurrentPage,
  setPublishModalOpen,
  setLatestPublishedDate,
  closeErrorModal,
} from '@/features/streetRate/streetRateSlice';
import PageFrame from '@/components/common/PageFrame';
import { StreetRatesTable, PublishConfirmModal, ErrorModal } from '@/components/widgets/StreetRate';
import './StreetRates.less';

const { Search } = Input;

const StreetRates = () => {
  // Redux state
  const dispatch = useDispatch();
  const apiParams = useSelector(selectStreetRatesApiParams);
  const search = useSelector(selectSearch);
  const sort = useSelector(selectSort);
  const orderby = useSelector(selectOrderBy);
  const totalFacilities = useSelector(selectStreetTotal);
  const savedRateChangedUnits = useSelector(selectSavedRateUnits);
  const publishModalOpen = useSelector(selectPublishModalOpen);
  const errorModalOpen = useSelector(selectErrorModalOpen);
  const errorLog = useSelector(selectErrorLog);
  const latestPublishedDate = useSelector(selectLatestPublishedDate);
  const paginationConfig = useSelector(selectPaginationConfig);

  // API queries and mutations
  const { isLoading, isFetching, refetch } = useGetStreetRatesFacilitiesQuery(apiParams);

  const [triggerExportCSV] = useLazyExportCSVQuery();
  const [submitAllRates, { isLoading: isSubmitting }] = useSubmitAllRatesMutation();
  const [runPythonModel, { isLoading: isRefreshing }] = useRunPythonModelMutation();

  // Event Handlers - Using Redux actions
  const handleSearch = (value) => {
    dispatch(setSearch(value));
  };

  const handleSort = (column, direction) => {
    dispatch(setSort({ column, direction }));
  };

  const handlePagination = (page) => {
    dispatch(setCurrentPage(page));
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
    dispatch(setPublishModalOpen(true));
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
      dispatch(setLatestPublishedDate(moment(new Date()).format('MM/DD/YYYY, hh:mm A')));
      message.success('Rates published successfully');
      dispatch(setPublishModalOpen(false));

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
    dispatch(closeErrorModal());
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
            ...paginationConfig,
            total: totalFacilities || 0,
            onChange: handlePagination,
          }}
          latestPublishedDate={latestPublishedDate}
          savedRateChangedUnitsCount={savedRateChangedUnits.length}
        />

        {/* Publish Confirmation Modal */}
        <PublishConfirmModal
          open={publishModalOpen}
          onOk={confirmPublishAllRates}
          onCancel={() => dispatch(setPublishModalOpen(false))}
          confirmLoading={isSubmitting}
          savedRateChangedUnitsCount={savedRateChangedUnits.length}
        />

        {/* Error Modal */}
        <ErrorModal open={errorModalOpen} onCancel={closeModalError} errorLog={errorLog} />
      </Space>
    </PageFrame>
  );
};

export default StreetRates;
