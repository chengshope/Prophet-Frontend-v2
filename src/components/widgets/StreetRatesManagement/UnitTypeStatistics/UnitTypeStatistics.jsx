import { useState, useMemo } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Typography,
  Tag,
  Modal,
  Select,
  InputNumber,
  Tooltip,
  message,
  Flex,
  Checkbox,
  DatePicker,
} from 'antd';
import {
  EditOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useGetUnitTypesQuery, useUpdateUnitTypeMutation } from '@/api/streetRatesApi';
import { formatCurrency } from '@/utils/formatters';
import dayjs from 'dayjs';
import { selectPmsType } from '@/features/auth/authSelector';
import { useDispatch, useSelector } from 'react-redux';
import { getSecondaryUnitTypeLabel } from '@/utils/unitHelpers';
import { updateFacility } from '@/features/street/streetSlice';

const { Text } = Typography;

const UnitTypeStatistics = ({ facilityId, rows, rateType, changedUnits = [] }) => {
  const [editingUnit, setEditingUnit] = useState(null);
  const [linkOrAnchorModalOpen, setLinkOrAnchorModalOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [removeConfirmModalOpen, setRemoveConfirmModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [linkData, setLinkData] = useState({ unitTypeId: null, adjustmentPercentage: 0 });
  const [categoryData, setCategoryData] = useState({ guide: null, variance: 0 });

  // Lock functionality state
  const [lockScheduleConfirmModalOpen, setLockScheduleConfirmModalOpen] = useState(false);
  const [lockScheduleModalOpen, setLockScheduleModalOpen] = useState(false);
  const [lockExpirationDate, setLockExpirationDate] = useState(null);
  const [unitToLock, setUnitToLock] = useState(null);

  const dispatch = useDispatch();

  const pmsType = useSelector(selectPmsType);

  // API hooks
  const { data: unitTypes } = useGetUnitTypesQuery(facilityId);
  const [updateUnitType] = useUpdateUnitTypeMutation();

  // Handle rate input change
  const handleRateChange = (unit, newRate) => {
    const updatedUnit = {
      ...unit,
      [rateType === 'street_rate' ? 'new_std_rate' : 'new_web_rate']: newRate,
    };
    // Pass newRate: true to track this as a rate change for publishing
    dispatch(updateFacility({ facilityId, unit: updatedUnit, newRate: true }));
  };

  const saveUnitTypeLink = async () => {
    if (!selectedUnit || !linkData.unitTypeId) return;

    try {
      await updateUnitType({
        id: selectedUnit.ut_id,
        master_unittype: linkData.unitTypeId,
        exception: true,
        adjustment_percentage: linkData.adjustmentPercentage / 100,
      }).unwrap();

      const updatedUnit = {
        ...selectedUnit,
        exception: true,
        master_unittype: linkData.unitTypeId,
        adjustment_percentage: linkData.adjustmentPercentage / 100,
      };

      dispatch(updateFacility({ facilityId, unit: updatedUnit }));
      setLinkModalOpen(false);
      setSelectedUnit(null);
      message.success('Unit type linked successfully');
    } catch {
      // automatically handled by RTK Query
    }
  };

  const saveUnitTypeCategory = async () => {
    if (!selectedUnit || !categoryData.guide) return;

    try {
      await updateUnitType({
        id: selectedUnit.ut_id,
        exception: true,
        guide: categoryData.guide,
        variance: categoryData.variance / 100,
      }).unwrap();

      const updatedUnit = {
        ...selectedUnit,
        exception: true,
        guide: categoryData.guide,
        variance: categoryData.variance / 100,
      };

      dispatch(updateFacility({ facilityId, unit: updatedUnit }));

      setCategoryModalOpen(false);
      setSelectedUnit(null);
      message.success('Unit type category updated successfully');
    } catch {
      // automatically handled by RTK Query
    }
  };

  // Handle removing unit type link/anchor
  const handleRemoveUnitType = async () => {
    if (!selectedUnit) return;

    try {
      await updateUnitType({
        id: selectedUnit.ut_id,
        exception: null,
        guide: null,
        variance: null,
        master_unittype: null,
        adjustment_percentage: 0,
      }).unwrap();

      const updatedUnit = {
        ...selectedUnit,
        exception: null,
        guide: null,
        variance: null,
        master_unittype: null,
        master_unittype_name: null,
        adjustment_percentage: 0,
      };

      dispatch(updateFacility({ facilityId, unit: updatedUnit }));
      setRemoveConfirmModalOpen(false);
      setSelectedUnit(null);
      message.success('Unit type anchor/link removed successfully');
    } catch {
      // automatically handled by RTK Query
      setRemoveConfirmModalOpen(false);
      setSelectedUnit(null);
    }
  };

  // Handle lock functionality
  const handleLockToggle = (unit, checked) => {
    if (checked) {
      // When locking, ask if they want to schedule expiration
      setUnitToLock(unit);
      setLockScheduleConfirmModalOpen(true);
    } else {
      // When unlocking, just unlock immediately
      handleLockUnitRate(unit, false);
    }
  };

  const handleLockUnitRate = (unit, locked, expirationDate = null) => {
    // Store lock changes locally (no immediate API call)
    const updatedUnit = {
      ...unit,
      locked,
      lock_expiration_date: expirationDate,
    };

    dispatch(updateFacility({ facilityId, unit: updatedUnit }));

    // Reset modal states
    setLockScheduleConfirmModalOpen(false);
    setLockScheduleModalOpen(false);
    setLockExpirationDate(null);
    setUnitToLock(null);
  };

  const handleScheduleLock = () => {
    setLockScheduleConfirmModalOpen(false);
    setLockScheduleModalOpen(true);
  };

  const confirmScheduledLock = () => {
    if (unitToLock) {
      const expirationDate = lockExpirationDate
        ? lockExpirationDate.format('YYYY-MM-DD HH:mm:ss')
        : null;
      handleLockUnitRate(unitToLock, true, expirationDate);
    }
  };

  // Unit type options for linking
  const unitTypeOptions = useMemo(() => {
    return (unitTypes || []).map((unitType) => ({
      value: unitType.id,
      label: `${unitType.unit_type} - Floor: ${unitType.floor || 'N/A'}`,
    }));
  }, [unitTypes]);

  const columns = [
    {
      title: (
        <Space>
          Unit Type
          <Tooltip title="Click the link icon to link similar unit types">
            <InfoCircleOutlined style={{ color: '#1890ff' }} />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'unit_type',
      key: 'unit_type',
      width: 200,
      render: (unitType, record) => (
        <Flex justify="space-between" gap={12}>
          <Flex vertical={true}>
            <Text>{unitType}</Text>
            {record.exception && (
              <>
                {record.guide && (
                  <Text style={{ color: '#1890ff' }}>
                    {getSecondaryUnitTypeLabel(record.guide)} $
                    {parseFloat(record?.variance) > 0
                      ? '+' + record.variance * 100
                      : record.variance * 100}
                    %
                  </Text>
                )}
                {record?.master_unittype_name && (
                  <Text style={{ color: '#1890ff' }}>
                    {record?.master_unittype_name}{' '}
                    {record?.adjustment_percentage !== 0
                      ? `+${record?.adjustment_percentage * 100}%`
                      : ''}
                  </Text>
                )}
              </>
            )}
          </Flex>
          <Flex>
            {record?.exception ? (
              <Button
                type="link"
                size="large"
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  setSelectedUnit(record);
                  setRemoveConfirmModalOpen(true);
                }}
                style={{
                  padding: 0,
                  height: 'auto',
                  color: '#ff1852ff',
                  fontSize: '20px',
                }}
              />
            ) : (
              <Button
                type="link"
                size="large"
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  setSelectedUnit(record);
                  setLinkOrAnchorModalOpen(true);
                }}
                style={{
                  padding: 0,
                  height: 'auto',
                  color: '#1890ff',
                  fontSize: '20px',
                }}
              />
            )}
          </Flex>
        </Flex>
      ),
    },
    {
      title: 'Attributes',
      dataIndex: 'unit_style',
      key: 'unit_style',
      width: 150,
      render: (text) => {
        if (!text) return '-';
        const styles = text
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        return (
          <Space wrap size={1}>
            {styles.map((style, index) => (
              <Tag key={index} size="small">
                {style}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: 'Physical Occupancy',
      dataIndex: 'physical_occupancy',
      key: 'physical_occupancy',
      width: 100,
      align: 'right',
      render: (value) => (value != null ? `${parseFloat(value).toFixed(2)}%` : '0.00%'),
    },
    {
      title: 'Vacant Units',
      dataIndex: 'available_units',
      key: 'available_units',
      width: 80,
      align: 'right',
      render: (value) => value || 0,
    },
    {
      title: `Today's ${rateType === 'street_rate' ? 'Street' : pmsType == 'storedge' ? 'Managed' : 'Web'}`,
      dataIndex: rateType === 'street_rate' ? 'std_rate' : 'web_rate',
      key: 'current_rate',
      width: 100,
      align: 'right',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Recommended Rate',
      dataIndex: rateType === 'street_rate' ? 'recommended_std_rate' : 'recommended_web_rate',
      key: 'recommended_rate',
      width: 110,
      align: 'right',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Difference $',
      key: 'difference',
      dataIndex: rateType === 'street_rate' ? 'difference_amount' : 'difference_amount_web',
      width: 100,
      align: 'right',
      render: (value) => {
        return (
          <Tag color={value >= 0 ? 'green' : 'volcano'}>
            {value >= 0 ? '+' : ''}
            {formatCurrency(value)}
          </Tag>
        );
      },
    },
    {
      title: 'Difference %',
      key: 'difference_percent',
      dataIndex: rateType === 'street_rate' ? 'difference_percent' : 'difference_percent_web',
      width: 100,
      align: 'right',
      render: (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`,
    },
    {
      title: 'New Rate',
      key: 'new_rate',
      width: 120,
      align: 'right',
      render: (_, record) => {
        const isEditing = editingUnit === record.ut_id;
        const isLocked = record.locked;
        const currentValue =
          record[rateType === 'street_rate' ? 'new_std_rate' : 'new_web_rate'] ||
          record[rateType === 'street_rate' ? 'recommended_std_rate' : 'recommended_web_rate'] ||
          0;
        const hasChanged = changedUnits.some((unit) => unit.ut_id === record.ut_id);

        if (isLocked) {
          return (
            <div
              style={{
                width: '100%',
                height: '32px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8c8c8c',
              }}
            >
              {formatCurrency(currentValue)}
            </div>
          );
        }

        if (isEditing) {
          return (
            <Input
              type="number"
              size="small"
              defaultValue={currentValue}
              onPressEnter={(e) => {
                const newRate = parseFloat(e.target.value) || 0;
                handleRateChange(record, newRate);
                setEditingUnit(null);
              }}
              onBlur={(e) => {
                const newRate = parseFloat(e.target.value) || 0;
                handleRateChange(record, newRate);
                setEditingUnit(null);
              }}
              autoFocus
              style={{ width: '100%' }}
            />
          );
        }

        return (
          <Space>
            <Text strong={hasChanged} style={{ color: hasChanged ? '#1890ff' : undefined }}>
              {formatCurrency(currentValue)}
            </Text>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => setEditingUnit(record.ut_id)}
              style={{ padding: 0 }}
              disabled={isLocked}
            />
          </Space>
        );
      },
    },
    {
      title: 'Lock Rate',
      key: 'lock_rate',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const isLocked = record.locked;
        const hasExpiration = record.lock_expiration_date;

        return (
          <Space>
            <Checkbox
              checked={isLocked}
              onChange={(e) => handleLockToggle(record, e.target.checked)}
            />
            {isLocked && hasExpiration && (
              <Tooltip title={`Expires: ${new Date(hasExpiration).toLocaleDateString()}`}>
                <Button
                  size="small"
                  type="text"
                  icon={<InfoCircleOutlined />}
                  onClick={() => {
                    setUnitToLock(record);
                    setLockExpirationDate(
                      record.lock_expiration_date ? dayjs(record.lock_expiration_date) : null
                    );
                    setLockScheduleModalOpen(true);
                  }}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={rows}
        rowKey="ut_id"
        pagination={false}
        size="small"
        scroll={{ x: 800 }}
        locale={{
          emptyText: 'No unit types available for this facility',
        }}
      />

      {/* Initial Link or Anchor Modal */}
      <Modal
        title="Link or Anchor Unit?"
        open={linkOrAnchorModalOpen}
        onCancel={() => {
          setLinkOrAnchorModalOpen(false);
          setSelectedUnit(null);
        }}
        footer={null}
        centered
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Space size="large">
            <Button
              type="default"
              size="large"
              onClick={() => {
                setLinkOrAnchorModalOpen(false);
                setLinkModalOpen(true);
              }}
              style={{
                minWidth: '100px',
                borderColor: '#ff4d4f',
                color: '#ff4d4f',
              }}
            >
              LINK
            </Button>
            <Button
              type="default"
              size="large"
              onClick={() => {
                setLinkOrAnchorModalOpen(false);
                setCategoryModalOpen(true);
              }}
              style={{
                minWidth: '100px',
                borderColor: '#ff4d4f',
                color: '#ff4d4f',
              }}
            >
              ANCHOR
            </Button>
          </Space>
        </div>
      </Modal>

      {/* Unit Type Linking Modal */}
      <Modal
        title="Select the unit type to link:"
        open={linkModalOpen}
        onCancel={() => {
          setLinkModalOpen(false);
          setSelectedUnit(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setLinkModalOpen(false);
              setSelectedUnit(null);
            }}
          >
            CANCEL
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={saveUnitTypeLink}
            style={{
              backgroundColor: '#ff4d4f',
              borderColor: '#ff4d4f',
            }}
          >
            SAVE
          </Button>,
        ]}
        centered
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            style={{ width: '100%' }}
            placeholder="Select unit type"
            value={linkData.unitTypeId}
            onChange={(value) => setLinkData({ ...linkData, unitTypeId: value })}
          >
            {unitTypeOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>

          <div style={{ marginTop: '20px' }}>
            <Text strong>Input your adjustment percentage (optional):</Text>
            <InputNumber
              style={{ width: '100%', marginTop: 8 }}
              placeholder="0%"
              value={linkData.adjustmentPercentage}
              onChange={(value) => setLinkData({ ...linkData, adjustmentPercentage: value || 0 })}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace('%', '')}
            />
          </div>
        </Space>
      </Modal>

      {/* Unit Type Category (Anchor) Modal */}
      <Modal
        title="Please select the unit category you'd like to anchor this unit type to:"
        open={categoryModalOpen}
        onCancel={() => {
          setCategoryModalOpen(false);
          setSelectedUnit(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setCategoryModalOpen(false);
              setSelectedUnit(null);
            }}
          >
            CANCEL
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={saveUnitTypeCategory}
            style={{
              backgroundColor: '#ff4d4f',
              borderColor: '#ff4d4f',
            }}
          >
            SAVE
          </Button>,
        ]}
        centered
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space wrap>
            <Button
              type={categoryData.guide === 'Drive Up' ? 'primary' : 'default'}
              onClick={() => setCategoryData({ ...categoryData, guide: 'Drive Up' })}
            >
              Drive Up
            </Button>
            <Button
              type={categoryData.guide === 'Climate Controlled' ? 'primary' : 'default'}
              onClick={() => setCategoryData({ ...categoryData, guide: 'Climate Controlled' })}
            >
              Climate Controlled
            </Button>
            <Button
              type={categoryData.guide === 'Parking' ? 'primary' : 'default'}
              onClick={() => setCategoryData({ ...categoryData, guide: 'Parking' })}
            >
              Parking
            </Button>
          </Space>

          <div style={{ marginTop: '20px' }}>
            <Text strong>Input your adjustment percentage:</Text>
            <InputNumber
              style={{ width: '100%', marginTop: 8 }}
              placeholder="5%"
              value={categoryData.variance}
              onChange={(value) => setCategoryData({ ...categoryData, variance: value || 0 })}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace('%', '')}
            />
          </div>
        </Space>
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        title="Are you sure you want to remove this unit type anchor?"
        open={removeConfirmModalOpen}
        onCancel={() => {
          setRemoveConfirmModalOpen(false);
          setSelectedUnit(null);
        }}
        footer={[
          <Button
            key="no"
            onClick={() => {
              setRemoveConfirmModalOpen(false);
              setSelectedUnit(null);
            }}
          >
            NO
          </Button>,
          <Button
            key="yes"
            type="primary"
            onClick={handleRemoveUnitType}
            style={{
              backgroundColor: '#ff4d4f',
              borderColor: '#ff4d4f',
            }}
          >
            YES
          </Button>,
        ]}
        centered
      ></Modal>

      {/* Lock Schedule Confirmation Modal */}
      <Modal
        title="Schedule expiration?"
        open={lockScheduleConfirmModalOpen}
        onCancel={() => {
          setLockScheduleConfirmModalOpen(false);
          setUnitToLock(null);
        }}
        footer={[
          <Button
            key="no"
            onClick={() => {
              if (unitToLock) {
                handleLockUnitRate(unitToLock, true);
              }
            }}
          >
            NO
          </Button>,
          <Button key="yes" type="primary" onClick={handleScheduleLock}>
            YES
          </Button>,
        ]}
        centered
      >
        <Text>Do you want to schedule an expiration date for this lock?</Text>
      </Modal>

      {/* Lock Schedule Date Modal */}
      <Modal
        title="Select expiration date"
        open={lockScheduleModalOpen}
        onCancel={() => {
          setLockScheduleModalOpen(false);
          setLockExpirationDate(null);
          setUnitToLock(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setLockScheduleModalOpen(false);
              setLockExpirationDate(null);
              setUnitToLock(null);
            }}
          >
            CANCEL
          </Button>,
          <Button key="confirm" type="primary" onClick={confirmScheduledLock}>
            CONFIRM
          </Button>,
        ]}
        centered
      >
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <DatePicker
            value={lockExpirationDate}
            onChange={(date) => setLockExpirationDate(date)}
            placeholder="Select expiration date"
            style={{ width: '100%' }}
          />
        </div>
      </Modal>
    </>
  );
};

export default UnitTypeStatistics;
