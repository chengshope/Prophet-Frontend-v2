import { useState, useEffect, useMemo } from 'react';
import { Row, Col, Input, Button, Modal, message, Space, Card, Typography } from 'antd';
import {
  CloudUploadOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  useGetExistingCustomersQuery,
  useGetExistingCustomersSummaryQuery,
  usePublishAllRateChangesMutation,
  useRunPythonModelMutation,
} from '@/api/existingCustomersApi';
import ExistingCustomersTable from './ExistingCustomersTable/ExistingCustomersTable';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getChangedEcriIDs, removeChangedEcriIDs } from '../../../utils/LegacyV1/localStorage';

const { Title, Text } = Typography;
const PAGE_SIZE = 10;

const ExistingCustomers = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('facility_name');
  const [orderby, setOrderby] = useState('asc');
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [changedTenants, setChangedTenants] = useState([]);
  const [latestPublishedDate, setLatestPublishedDate] = useState('');
  const [updatedFacilitiesCount, setUpdatedFacilitiesCount] = useState(0);
  const [errorLog, setErrorLog] = useState('');
  const [modalErrorIsOpen, setModalErrorIsOpen] = useState(false);

  const portfolioSettings = useSelector((state) => state.portfolio.settings);

  // API hooks
  const { data, isLoading, isFetching, refetch } = useGetExistingCustomersQuery({
    page: currentPage,
    search,
    sort,
    orderby,
  });

  const { data: summaryData } = useGetExistingCustomersSummaryQuery();

  const [publishAllRateChanges, { isLoading: isPublishing }] = usePublishAllRateChangesMutation();
  const [runPythonModel, { isLoading: isRunningModel }] = useRunPythonModelMutation();

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Handle sorting
  const handleSort = (column, direction) => {
    setSort(column);
    setOrderby(direction);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  // Handle facility changes
  const handleFacilitiesChanged = (facilityId) => {
    const changedIds = getChangedEcriIDs();
    if (!changedIds.includes(facilityId)) {
      setChangedTenants([...changedTenants, facilityId]);
      setUpdatedFacilitiesCount((prev) => prev + 1);
    }
  };

  // Handle publish all rates
  const handlePublishAllRates = () => {
    const changedIds = getChangedEcriIDs();
    if (changedIds.length === 0) {
      message.warning('No changes to publish');
      return;
    }
    setPublishModalOpen(true);
  };

  const confirmPublishAllRates = async () => {
    try {
      const changedIds = getChangedEcriIDs();
      await publishAllRateChanges(changedIds).unwrap();
      setLatestPublishedDate(moment(new Date()).format('MM/DD/YYYY, hh:mm A'));
      message.success('Rate changes published successfully');
      setPublishModalOpen(false);
      removeChangedEcriIDs();
      setChangedTenants([]);
      setUpdatedFacilitiesCount(0);
      refetch();
    } catch (error) {
      console.error('Error publishing rates:', error);
      setErrorLog(error?.data?.message || 'Failed to publish rate changes');
      setModalErrorIsOpen(true);
      setPublishModalOpen(false);
    }
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

  // Handle CSV export
  const handleExportCSV = () => {
    if (!data?.data || data.data.length === 0) {
      message.warning('No data to export');
      return;
    }

    try {
      const csvData = data.data.map((facility) => ({
        'Facility Name': facility.facility_name,
        Market: `${facility.city}, ${facility.state}`,
        'Eligible Tenants': facility.tenant_total || 0,
        'Average Rate Increase %': facility.avr_rate_increase_percent?.toFixed(1) || '0.0',
        'Estimated Revenue Increase': facility.estimated_revenue_increase?.toFixed(2) || '0.00',
        'Average Move-out Probability':
          (facility.avr_moveout_probability * 100)?.toFixed(1) || '0.0',
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map((row) => Object.values(row).join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `existing_customers_${moment().format('YYYY-MM-DD')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success('CSV exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      message.error('Failed to export CSV');
    }
  };

  // Calculate summary data
  const summaryStats = useMemo(() => {
    if (!summaryData) return null;

    return {
      totalTenants: summaryData.sum_tenants || 0,
      averageRateIncrease: summaryData.sum_avr_rate_inc || 0,
      estimatedRevenueIncrease: summaryData.sum_rev_inc || 0,
      averageMoveOutProbability: summaryData.sum_avr_mop || 0,
    };
  }, [summaryData]);

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Existing Customers
          </Title>
        </Col>
      </Row>

      {/* Summary Cards */}
      {summaryStats && (
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Text type="secondary">Total Eligible Tenants</Text>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {summaryStats.totalTenants.toLocaleString()}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Text type="secondary">Average Rate Increase %</Text>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {summaryStats.averageRateIncrease.toFixed(1)}%
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Text type="secondary">Estimated Revenue Increase</Text>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                ${summaryStats.estimatedRevenueIncrease.toLocaleString()}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Text type="secondary">Average Move-out Probability</Text>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
                {summaryStats.averageMoveOutProbability.toFixed(1)}%
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Controls Row */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
        <Col xs={24} md={12}>
          <Input
            placeholder="Search facilities..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
        </Col>
        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExportCSV}
              disabled={!data?.data || data.data.length === 0}
            >
              Export CSV
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleRefreshModel} loading={isRunningModel}>
              Refresh Model
            </Button>
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={handlePublishAllRates}
              loading={isPublishing}
              danger={updatedFacilitiesCount > 0}
            >
              {updatedFacilitiesCount > 0 ? 'Publish Changes' : 'Publish All Rates'}
            </Button>
          </Space>
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

      {/* Existing Customers Table */}
      <ExistingCustomersTable
        data={data}
        loading={isLoading || isFetching}
        sortColumn={sort}
        sortDirection={orderby}
        onSortChanged={handleSort}
        onFacilitiesChanged={handleFacilitiesChanged}
        pagination={{
          current: currentPage,
          total: data?.pagination?.total || 0,
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
        title="Confirm Publish Rate Changes"
        open={publishModalOpen}
        onOk={confirmPublishAllRates}
        onCancel={() => setPublishModalOpen(false)}
        confirmLoading={isPublishing}
        okText="Publish"
        cancelText="Cancel"
      >
        <p>Are you sure you want to publish all rate changes? This action cannot be undone.</p>
        {updatedFacilitiesCount > 0 && (
          <p>
            <strong>{updatedFacilitiesCount} facilities</strong> have pending changes.
          </p>
        )}
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
    </div>
  );
};

export default ExistingCustomers;
