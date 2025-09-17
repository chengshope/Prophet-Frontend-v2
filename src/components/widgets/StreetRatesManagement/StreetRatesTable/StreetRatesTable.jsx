import { useState } from 'react';
import { Table, Button, Space, Typography, Card, Modal, message, Flex } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { useSubmitIndividualRatesMutation, useSaveRateChangesMutation } from '@/api/streetRatesApi';
import UnitTypeStatistics from '../UnitTypeStatistics';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import './StreetRatesTable.less';

const { Text } = Typography;

const StreetRatesTable = ({
  data,
  loading,
  sortColumn,
  sortDirection,
  onSortChanged,
  onFacilitiesChanged,
  pagination,
  changedUnits,
  setChangedUnits,
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

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

  // Handle unit rate changes
  const handleUnitChange = async (facility, updatedUnit) => {
    try {
      // Update the facility's units_statistics
      const updatedFacility = {
        ...facility,
        units_statistics: facility.units_statistics.map((unit) =>
          unit.ut_id === updatedUnit.ut_id ? updatedUnit : unit
        ),
      };

      // Save changes to backend
      await saveRateChanges({
        facilityId: facility.facility_id,
        units: updatedFacility.units_statistics,
      }).unwrap();

      // Update parent component
      onFacilitiesChanged(updatedFacility);

      // Update changed units tracking
      const existingIndex = changedUnits.findIndex((unit) => unit.ut_id === updatedUnit.ut_id);
      if (existingIndex >= 0) {
        const newChangedUnits = [...changedUnits];
        newChangedUnits[existingIndex] = updatedUnit;
        setChangedUnits(newChangedUnits);
      } else {
        setChangedUnits([...changedUnits, updatedUnit]);
      }
    } catch (error) {
      message.error('Failed to save rate changes');
    }
  };

  // Handle individual facility publish
  const handlePublishIndividual = (facility) => {
    setSelectedFacility(facility);
    setPublishModalOpen(true);
  };

  const confirmPublishIndividual = async () => {
    if (!selectedFacility) return;

    try {
      const facilityChangedUnits = changedUnits.filter((unit) =>
        selectedFacility.units_statistics?.some((facilityUnit) => facilityUnit.ut_id === unit.ut_id)
      );

      await submitIndividualRates({
        facilityId: selectedFacility.facility_id,
        changedUnitStatistics: facilityChangedUnits,
      }).unwrap();

      message.success(`Rates published successfully for ${selectedFacility.facility_name}`);
      setPublishModalOpen(false);
      setSelectedFacility(null);

      // Remove published units from changed units
      setChangedUnits(
        changedUnits.filter(
          (unit) =>
            !facilityChangedUnits.some((publishedUnit) => publishedUnit.ut_id === unit.ut_id)
        )
      );
    } catch (error) {
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

        return (
          <Flex vertical={true} gap={10} style={{ padding: '0 8px' }}>
            <Button
              onClick={() => handleExpand(!isExpanded, record)}
              variant={isExpanded ? 'solid' : 'outlined'}
              color={isExpanded ? 'danger' : 'default'}
              block
            >
              {isExpanded ? 'Cancel' : hasChanges ? 'View Edits' : 'Unit Mix Detail'}
            </Button>
            <Button
              type="primary"
              onClick={() => handlePublishIndividual(record)}
              disabled={!hasChanges}
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
        dataSource={data}
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
                handleChange={(updatedUnit) => handleUnitChange(record, updatedUnit)}
                rateType="street_rate"
                changedUnits={changedUnits}
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
              changedUnits.filter((unit) =>
                selectedFacility.units_statistics?.some(
                  (facilityUnit) => facilityUnit.ut_id === unit.ut_id
                )
              ).length
            }{' '}
            unit types.
          </p>
        )}
      </Modal>
    </>
  );
};

export default StreetRatesTable;
