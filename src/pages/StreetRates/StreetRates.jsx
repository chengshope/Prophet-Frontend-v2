import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Row, Space, Col, Input, Button, message } from 'antd';
import { CloudUploadOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';

import {
  useGetStreetRatesFacilitiesQuery,
  useSubmitAllRatesMutation,
  useLazyExportCSVQuery,
} from '@/api/streetRatesApi';
import { selectSavedRateUnits, selectStreetTotal } from '@/features/street/streetSelector';
import { clearSavedRateChanges } from '@/features/street/streetSlice';
import { removeSavedRateUnits } from '@/utils/localStorage';
import { handleCSVExport } from '@/utils/csvExport';
import PageFrame from '@/components/common/PageFrame';
import { StreetRatesTable, PublishConfirmModal, ErrorModal } from '@/components/widgets/StreetRate';
import './StreetRates.less';

const { Search } = Input;

const StreetRates = () => {
  const [search, setSearchState] = useState('');
  const [sort, setSortState] = useState('facility_name');
  const [orderby, setOrderByState] = useState('asc');
  const [currentPage, setCurrentPageState] = useState(1);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorLog, setErrorLog] = useState('');
  const [latestPublishedDate, setLatestPublishedDate] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalFacilities = useSelector(selectStreetTotal);
  const savedRateChangedUnits = useSelector(selectSavedRateUnits);

  const apiParams = useMemo(() => ({
    search,
    sort,
    orderby,
    page: currentPage,
    limit: 10,
  }), [search, sort, orderby, currentPage]);

  const paginationConfig = useMemo(() => ({
    current: currentPage,
    pageSize: 10,
    showSizeChanger: false,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} facilities`,
  }), [currentPage]);

  const { isLoading, isFetching } = useGetStreetRatesFacilitiesQuery(apiParams);

  const [triggerExportCSV] = useLazyExportCSVQuery();
  const [submitAllRates, { isLoading: isSubmitting }] = useSubmitAllRatesMutation();

  const handleSearch = (value) => {
    setSearchState(value);
    setCurrentPageState(1);
  };

  const handleSort = (column, direction) => {
    setSortState(column);
    setOrderByState(direction);
  };

  const handlePagination = (page) => {
    setCurrentPageState(page);
  };

  const handleRefreshModel = () => {
    dispatch(clearSavedRateChanges());
    removeSavedRateUnits();
    navigate('/loading?redirect=street-rates');
  };

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

      await submitAllRates(savedRateChangedUnits).unwrap();
      setLatestPublishedDate(moment(new Date()).format('MM/DD/YYYY, hh:mm A'));
      message.success('Rates published successfully');
      setPublishModalOpen(false);

      removeSavedRateUnits();
      dispatch(clearSavedRateChanges());
    } catch (error) {
      setErrorLog(error?.data?.message || 'An error occurred while publishing rates');
      setErrorModalOpen(true);
    }
  };

  const exportCSV = () => {
    handleCSVExport(
      () => triggerExportCSV().unwrap(),
      'street_rates',
      (msg) => message.success(msg),
      (msg) => message.error(msg)
    );
  };

  const closeModalError = () => {
    setErrorModalOpen(false);
    setErrorLog('');
  };

  return (
    <PageFrame
      title="Street Rates"
      extra={[
        <Space>
          <Button color="blue" variant="filled" icon={<DownloadOutlined />} onClick={exportCSV}>
            Export CSV
          </Button>
          <Button
            color="danger"
            variant="filled"
            icon={<ReloadOutlined />}
            loading={false}
            onClick={handleRefreshModel}
          >
            Refresh Model
          </Button>
        </Space>,
      ]}
    >
      <Space direction="vertical" size="large" className="street-rates-management">
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

        <PublishConfirmModal
          open={publishModalOpen}
          onOk={confirmPublishAllRates}
          onCancel={() => setPublishModalOpen(false)}
          confirmLoading={isSubmitting}
          savedRateChangedUnitsCount={savedRateChangedUnits.length}
        />

        <ErrorModal open={errorModalOpen} onCancel={closeModalError} errorLog={errorLog} />
      </Space>
    </PageFrame>
  );
};

export default StreetRates;
