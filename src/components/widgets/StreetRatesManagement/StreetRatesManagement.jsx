import { useState, useEffect } from 'react';
import { Row, Space, Col, Input, Button, Modal, message } from 'antd';
import { CloudUploadOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import {
  useGetStreetRatesFacilitiesQuery,
  useSubmitAllRatesMutation,
  useRunPythonModelMutation,
} from '@/api/streetRatesApi';
import StreetRatesTable from './StreetRatesTable';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import moment from 'moment';
// Removed legacy v1 imports
import { selectPortfolioId } from '@/features/auth/authSelector';
import { getChangedUnits, getRateChangedUnits, selectStreetTotal, selectChangedFacilities } from '@/features/street/streetSelector';
import { clearAllRateChangedUnits } from '@/features/street/streetSlice';
import { useDispatch } from 'react-redux';

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
  const changedUnits = useSelector(getChangedUnits);
  const rateChangedUnits = useSelector(getRateChangedUnits);
  const changedFacilitiesFromStore = useSelector(selectChangedFacilities);

  // API queries and mutations
  const {
    data,
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
      message.error('Failed to refresh model');
    }
  };

  // Handle publish all rates
  const handlePublishNewRates = () => {
    setPublishModalOpen(true);
  };

  const confirmPublishAllRates = async () => {
    try {
      if (rateChangedUnits.length === 0) {
        message.warning('No rate changes to publish');
        setPublishModalOpen(false);
        return;
      }

      // Use only units with rate changes for publishing
      await submitAllRates(rateChangedUnits).unwrap();
      setLatestPublishedDate(moment(new Date()).format('MM/DD/YYYY, hh:mm A'));
      message.success('Rates published successfully');
      setPublishModalOpen(false);

      // Clear the rate changed units after successful publishing
      dispatch(clearAllRateChangedUnits());
    } catch (error) {
      console.error('Error publishing rates:', error);

      // Enhanced error handling from v1
      let errorMessage = 'Failed to publish rates';
      let errorLogs = error?.data?.errors || [];

      if (errorLogs.length > 0) {
        const logMessages = errorLogs
          .slice(0, 3)
          .map((log) => log)
          .join('\n');

        if (errorLogs.length > 3) {
          errorMessage = logMessages + '\n...';
        } else {
          errorMessage = logMessages;
        }

        setErrorLog(errorMessage);
        setModalErrorIsOpen(true);
      } else {
        message.error(errorMessage);
      }
    }
  };

  // CSV Export functionality
  const exportCSV = async () => {
    try {
      if (!data?.data || data.data.length === 0) {
        message.warning('No data to export');
        return;
      }

      const csvData = data.data.map(facility => ({
        'Facility Name': facility.facility_name,
        'Market': `${facility.city}, ${facility.state}`,
        'Total Units': facility.total_units || 0,
        'Occupied Units': facility.occupied_units || 0,
        'Occupancy Rate': facility.occupancy_rate ? `${(facility.occupancy_rate * 100).toFixed(1)}%` : '0%',
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
            onClick={handlePublishNewRates}
            disabled={rateChangedUnits.length === 0}
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
        <p>This will update rates for {rateChangedUnits.length} unit types across all facilities.</p>
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
