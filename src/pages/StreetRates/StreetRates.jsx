import { CloudUploadOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Input, message, Row, Space } from 'antd';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useGetPortfolioSettingsQuery } from '@/api/settingsApi';
import {
  useGetStreetRatesFacilitiesQuery,
  useLazyExportCSVQuery,
  useSubmitAllRatesMutation,
} from '@/api/streetRatesApi';
import PageFrame from '@/components/common/PageFrame';
import { ErrorModal, PublishConfirmModal, StreetRatesTable } from '@/components/widgets/StreetRate';
import { selectPortfolioId } from '@/features/auth/authSelector';
import {
  selectSavedRateUnits,
  selectStreetRatesTotal,
} from '@/features/streetRates/streetRatesSelector';
import { clearSavedRateChanges } from '@/features/streetRates/streetRatesSlice';
import { handleCSVExport } from '@/utils/csvExport';
import { removeSavedRateUnits } from '@/utils/localStorage';
import './StreetRates.less';

const { Search } = Input;

const StreetRates = () => {
  const [searchInput, setSearchInput] = useState('');
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
  const portfolioId = useSelector(selectPortfolioId);
  const totalFacilities = useSelector(selectStreetRatesTotal);
  const savedRateChangedUnits = useSelector(selectSavedRateUnits);

  const { data: portfolioSettings } = useGetPortfolioSettingsQuery(portfolioId, {
    skip: !portfolioId,
  });

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

  const { isLoading, isFetching } = useGetStreetRatesFacilitiesQuery(apiParams, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchState(searchInput);
      setCurrentPageState(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

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

  const [triggerExportCSV] = useLazyExportCSVQuery();
  const [submitAllRates, { isLoading: isSubmitting }] = useSubmitAllRatesMutation();

  const handleSearch = (value) => {
    setSearchInput(value);
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
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              onSearch={(value) => setSearchInput(value)}
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
          onSortChanged={handleSort}
          pagination={{
            ...paginationConfig,
            total: totalFacilities || 0,
            onChange: handlePagination,
          }}
          portfolioSettings={portfolioSettings}
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
