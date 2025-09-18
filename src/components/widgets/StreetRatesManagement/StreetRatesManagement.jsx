import { useState, useEffect } from 'react';
import { Row, Space, Col, Input, Button, Modal, message } from 'antd';
import { CloudUploadOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import {
  useGetStreetRatesFacilitiesQuery,
  useSubmitAllRatesMutation,
  useRunPythonModelMutation,
  useLazyExportCSVQuery,
} from '@/api/streetRatesApi';
import StreetRatesTable from './StreetRatesTable';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import moment from 'moment';
// Removed legacy v1 imports
import { selectPortfolioId } from '@/features/auth/authSelector';
import {
  getSavedRateChangedUnits,
  selectStreetTotal,
  selectChangedFacilities,
} from '@/features/street/streetSelector';
import { clearSavedRateChanges } from '@/features/street/streetSlice';
import { useDispatch } from 'react-redux';
import { removeSavedRateUnits } from '@/utils/localStorage';

const { Search } = Input;
const PAGE_SIZE = 10;

const StreetRatesManagement = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('facility_name');
  const [orderby, setOrderby] = useState('asc');

  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [modalErrorIsOpen, setModalErrorIsOpen] = useState(false);
  const [errorLog, setErrorLog] = useState('');

  const [latestPublishedDate, setLatestPublishedDate] = useState('');
  const [updatedFacilitiesCount, setUpdatedFacilitiesCount] = useState(0);
  const [portfolioSettings, setPortfolioSettings] = useState();

  const [changedFacilities, setChangedFacilities] = useState(null);

  // Get user info from Redux store
  const dispatch = useDispatch();
  const portfolio_id = useSelector(selectPortfolioId);
  const totalFacilities = useSelector(selectStreetTotal);
  const savedRateChangedUnits = useSelector(getSavedRateChangedUnits); // Saved rate changes (ready for publishing)
  const changedFacilitiesFromStore = useSelector(selectChangedFacilities);

  // API queries and mutations
  const { data, isLoading, isFetching, refetch } = useGetStreetRatesFacilitiesQuery({
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

  useEffect(() => {
    const getPortfolioSettings = async () => {
      if (portfolio_id) {
        try {
          // Portfolio settings would be fetched from the appropriate API
          // For now, set empty object to prevent errors
          setPortfolioSettings({});
        } catch (error) {
          console.error('Error fetching portfolio settings:', error);
          setPortfolioSettings({});
        }
      }
    };
    getPortfolioSettings();
  }, [portfolio_id]);

  // Track updated facilities count
  useEffect(() => {
    setUpdatedFacilitiesCount(changedFacilitiesFromStore.length);
  }, [changedFacilitiesFromStore]);

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
  const exportCSV = async () => {
    try {
      const response = await triggerExportCSV().unwrap();

      // The API returns CSV content directly
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const formattedDate = dayjs().format('YYYY_MM_DD');
      link.setAttribute('download', `${formattedDate}_street_rates.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success('CSV exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      message.error('Failed to export CSV');
    }
  };

  // Close error modal
  const closeModalError = () => {
    setModalErrorIsOpen(false);
    setErrorLog('');
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
          <Button icon={<DownloadOutlined />} onClick={exportCSV}>
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
          <Button
            type="primary"
            icon={<CloudUploadOutlined />}
            loading={isSubmitting}
            disabled={savedRateChangedUnits.length === 0}
            onClick={handlePublishNewRates}
          >
            Publish New Rates
          </Button>
        </Col>
      </Row>

      {/* Status Information Row */}
      <Row justify="space-between" style={{ padding: '0 8px', fontSize: '14px', color: '#8c8c8c' }}>
        <Col>{latestPublishedDate && `Last Updated: ${latestPublishedDate}`}</Col>
        <Col>
          {updatedFacilitiesCount > 0 &&
            `${updatedFacilitiesCount} ${updatedFacilitiesCount === 1 ? 'Facility' : 'Facilities'} Edited`}
        </Col>
      </Row>

      {/* Street Rates Table */}
      <StreetRatesTable
        loading={isLoading || isFetching}
        sortColumn={sort}
        sortDirection={orderby}
        onSortChanged={handleSort}
        changedFacilities={changedFacilities}
        setChangedFacilities={setChangedFacilities}
        pagination={{
          current: currentPage,
          total: totalFacilities || 0,
          pageSize: PAGE_SIZE,
          onChange: handlePagination,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} facilities`,
        }}
        portfolioSettings={portfolioSettings}
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
        <p>
          This will update rates for {savedRateChangedUnits.length} saved unit types across all
          facilities.
        </p>
      </Modal>

      {/* Error Modal */}
      <Modal
        title="Error Alert"
        open={modalErrorIsOpen}
        onCancel={closeModalError}
        footer={[
          <Button key="close" onClick={closeModalError}>
            Close
          </Button>,
        ]}
      >
        <div style={{ color: '#ff4d4f', marginBottom: '16px' }}>
          There was an error publishing your rates. Please try again later or reach out to our
          Customer Success team for more information.
        </div>
        {errorLog && (
          <div style={{ whiteSpace: 'pre-wrap', fontSize: '12px', color: '#8c8c8c' }}>
            {errorLog}
          </div>
        )}
      </Modal>
    </Space>
  );
};

export default StreetRatesManagement;
