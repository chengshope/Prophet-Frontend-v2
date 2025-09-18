import { useState } from 'react';
import { Table, Button, Space, Typography, Card, Modal, message, Flex } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { useSubmitIndividualRatesMutation, useSaveRateChangesMutation } from '@/api/streetRatesApi';
import UnitTypeStatistics from '../UnitTypeStatistics';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import './StreetRatesTable.less';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getChangedUnits,
  getChangedUnitsByFacilityId,
  selectStreetFacilities,
  selectNewRateUnits,
  selectSavedRateUnits,
} from '@/features/street/streetSelector';
import { getRateType } from '@/utils/rateHelper';
import {
  clearChangedUnitByFacilityId,
  mergeToSavedRateChanges,
  clearSavedRateChangesByIds,
} from '@/features/street/streetSlice';
import {
  mergeSavedRateUnits,
  removeSavedRateUnitsByIds,
  setSavedRateUnits,
} from '@/utils/localStorage';

const { Text } = Typography;

const StreetRatesTable = ({
  loading,
  sortColumn,
  sortDirection,
  onSortChanged,
  pagination,
  portfolioSettings,
}) => {
  const facilities = useSelector(selectStreetFacilities);
  const dispatch = useDispatch();

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const navigate = useNavigate();

  const changedUnitsByFacility = useSelector(getChangedUnitsByFacilityId);
  const changedUnits = useSelector(getChangedUnits);
  const newRateUnits = useSelector(selectNewRateUnits);
  const savedRateUnits = useSelector(selectSavedRateUnits);

  const [submitIndividualRates, { isLoading: isSubmittingIndividual }] =
    useSubmitIndividualRatesMutation();
  const [saveRateChanges] = useSaveRateChangesMutation();

  // Handle row expansion
  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.id]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.id));
    }
  };

  // Handle save changes for current facility
  const handleSaveChanges = async (facility) => {
    try {
      // Get all changed units for this facility
      const facilityChangedUnits = changedUnitsByFacility[facility.facility_id] || [];

      // Save ALL changes to backend (rates + locks + other changes)
      await saveRateChanges({
        facilityId: facility.facility_id,
        units: facilityChangedUnits,
      }).unwrap();

      // After successful save, move ONLY rate changes to saved state for publishing
      const facilityRateChangedUnits = newRateUnits.filter(
        (unit) => unit.facility_id === facility.facility_id
      );

      if (facilityRateChangedUnits.length > 0) {
        // Merge rate changes to localStorage and RTK state
        const updatedSavedUnits = mergeSavedRateUnits(facilityRateChangedUnits);
        dispatch(mergeToSavedRateChanges(facilityRateChangedUnits));

        // Update localStorage with the merged data
        setSavedRateUnits(updatedSavedUnits);
      }

      // Clear all changes for this facility from RTK state
      dispatch(clearChangedUnitByFacilityId(facility.facility_id));

      message.success('Changes saved successfully');
    } catch (error) {
      console.error('Error saving rate changes:', error);
      message.error('Failed to save rate changes');
      // Keep unsaved changes in state for retry
    }
  };

  // Handle cancel/close for current facility
  const handleClose = (facility) => {
    // Just close without saving
    setExpandedRowKeys(expandedRowKeys.filter((key) => key !== facility.id));
  };

  // Handle individual facility publish
  const handlePublishIndividual = (facility) => {
    setSelectedFacility(facility);
    setPublishModalOpen(true);
  };

  const confirmPublishIndividual = async () => {
    if (!selectedFacility) return;

    try {
      // Get only SAVED rate changes for this facility
      const facilitySavedRateChangedUnits = savedRateUnits.filter(
        (unit) => unit.facility_id === selectedFacility.facility_id
      );

      if (facilitySavedRateChangedUnits.length === 0) {
        message.warning(
          'No saved rate changes to publish for this facility. Please save changes first.'
        );
        setPublishModalOpen(false);
        setSelectedFacility(null);
        return;
      }

      await submitIndividualRates({
        facilityId: selectedFacility.facility_id,
        changedUnitStatistics: facilitySavedRateChangedUnits,
      }).unwrap();

      message.success(`Rates published successfully for ${selectedFacility.facility_name}`);
      setPublishModalOpen(false);
      setSelectedFacility(null);

      // Remove published units from saved rate changes (localStorage and RTK state)
      const publishedUnitIds = facilitySavedRateChangedUnits.map((unit) => unit.ut_id);
      removeSavedRateUnitsByIds(publishedUnitIds);
      dispatch(clearSavedRateChangesByIds(publishedUnitIds));
    } catch (error) {
      console.log(error);
      message.error('Failed to publish rates');
    }
  };

  const columns = [
    {
      title: 'Facility',
      dataIndex: 'facility_name',
      key: 'facility_name',
      width: 250,
      fixed: 'left',
      sorter: true,
      sortOrder: sortColumn === 'facility_name' ? `${sortDirection}end` : null,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.facility_name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.address}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.market}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Market',
      dataIndex: 'market',
      key: 'market',
      width: 140,
      align: 'right',
      sorter: true,
    },
    {
      title: 'Physical Occupancy %',
      dataIndex: 'physical_occupancy',
      key: 'physical_occupancy',
      width: 140,
      align: 'right',
      sorter: true,
      sortOrder: sortColumn === 'physical_occupancy' ? `${sortDirection}end` : null,
      render: (value) => (value != null ? `${parseFloat(value).toFixed(2)}%` : '0.00%'),
    },
    {
      title: 'Avg Rate Change %',
      dataIndex: 'avr_rate_change_percent',
      key: 'avr_rate_change_percent',
      width: 130,
      align: 'right',
      sorter: true,
      render: (value) => {
        if (value == null) return '0.00%';
        const numValue = parseFloat(value);
        const color = numValue >= 0 ? '#52c41a' : '#ff4d4f';
        return <span style={{ color }}>{formatPercent(numValue / 100)}</span>;
      },
    },
    {
      title: 'Avg Rate Change $',
      dataIndex: 'avr_rate_change_amount',
      key: 'avr_rate_change_amount',
      width: 130,
      align: 'right',
      sorter: true,
      render: (value) => {
        if (value == null) return '$0.00';
        const numValue = parseFloat(value);
        const color = numValue >= 0 ? '#52c41a' : '#ff4d4f';
        return <span style={{ color }}>{formatCurrency(numValue)}</span>;
      },
    },
    {
      title: 'Largest Increase',
      dataIndex: 'largest_increase',
      key: 'largest_increase',
      width: 120,
      align: 'right',
      sorter: true,
      render: (value) => (value != null ? formatCurrency(value) : '$0.00'),
    },
    {
      title: 'Largest Decrease',
      dataIndex: 'largest_decrease',
      key: 'largest_decrease',
      width: 120,
      align: 'right',
      sorter: true,
      render: (value) => (value != null ? formatCurrency(value) : '$0.00'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      fixed: 'right',
      render: (_, record) => {
        const isExpanded = expandedRowKeys.includes(record.id);
        const hasChanges = changedUnits.some((unit) =>
          record.units_statistics?.some((facilityUnit) => facilityUnit.ut_id === unit.ut_id)
        );
        const hasSavedRateChanges = savedRateUnits.some(
          (unit) => unit.facility_id === record.facility_id
        );

        return (
          <Flex vertical={true} gap={10} style={{ padding: '0 8px' }}>
            <Button
              onClick={() =>
                isExpanded
                  ? hasChanges
                    ? handleSaveChanges(record)
                    : handleClose(record)
                  : handleExpand(true, record)
              }
              variant={isExpanded ? 'solid' : 'outlined'}
              color={isExpanded ? 'danger' : 'default'}
              block
            >
              {isExpanded
                ? hasChanges
                  ? 'Save Changes'
                  : 'Cancel'
                : hasChanges
                  ? 'View Edits'
                  : 'Unit Mix Detail'}
            </Button>
            <Button
              variant="outlined"
              color="default"
              disabled={!isExpanded && !hasSavedRateChanges}
              onClick={() =>
                isExpanded ? navigate(`/competitors/${record.id}`) : handlePublishIndividual(record)
              }
              block
            >
              {isExpanded ? 'View Comps' : 'Publish Rates'}
            </Button>
          </Flex>
        );
      },
    },
  ];

  // Handle table sorting
  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter && sorter.field) {
      const direction = sorter.order === 'ascend' ? 'asc' : 'desc';
      onSortChanged(sorter.field, direction);
    }
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={facilities}
        loading={loading}
        rowKey={(record) => record.id || record.facility_id}
        pagination={pagination}
        scroll={{ x: 1200 }}
        bordered
        onChange={handleTableChange}
        className="street-rates-table"
        expandable={{
          expandedRowKeys,
          onExpand: handleExpand,
          expandedRowRender: (record) => (
            <Card styles={{ body: { padding: 0 } }}>
              <UnitTypeStatistics
                facilityId={record.facility_id}
                rows={record.units_statistics || []}
                rateType={getRateType(record, portfolioSettings)}
                changedUnits={changedUnits}
                streetRateSettings={portfolioSettings?.street_rate_settings}
              />
            </Card>
          ),
          rowExpandable: (record) => record.units_statistics && record.units_statistics.length > 0,
        }}
        locale={{
          emptyText: (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px 20px',
                color: '#8c8c8c',
              }}
            >
              <DollarOutlined
                style={{ fontSize: '48px', marginBottom: '16px', color: '#d9d9d9' }}
              />
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: '#595959',
                }}
              >
                No Street Rate Data
              </div>
              <div style={{ fontSize: '14px', textAlign: 'center', lineHeight: '1.5' }}>
                Street rate information will appear here when available.
                <br />
                Check your facility selection or refresh the data.
              </div>
            </div>
          ),
        }}
      />

      {/* Individual Publish Modal */}
      <Modal
        title={`Publish Rates - ${selectedFacility?.facility_name}`}
        open={publishModalOpen}
        onOk={confirmPublishIndividual}
        onCancel={() => {
          setPublishModalOpen(false);
          setSelectedFacility(null);
        }}
        confirmLoading={isSubmittingIndividual}
        okText="Publish"
        cancelText="Cancel"
      >
        <p>Are you sure you want to publish the new rates for this facility?</p>
        {selectedFacility && (
          <p>
            This will update rates for{' '}
            {
              savedRateUnits.filter((unit) => unit.facility_id === selectedFacility.facility_id)
                .length
            }{' '}
            unit types.
          </p>
        )}
      </Modal>
    </>
  );
};

export default StreetRatesTable;
