import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  Input,
  Button,
  Space,
  Typography,
  Tag,
  Tooltip,
  message,
  Flex,
  Checkbox,
} from 'antd';
import {
  EditOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { useGetUnitTypesQuery, useUpdateUnitTypeMutation } from '@/api/streetRatesApi';
import { selectPmsType } from '@/features/auth/authSelector';
import { updateFacility } from '@/features/street/streetSlice';
import { formatCurrency } from '@/utils/formatters';
import { getSecondaryUnitTypeLabel } from '@/utils/unitHelpers';
import LinkOrAnchorModal from '@/widget/Modal/LinkOrAnchorModal';
import UnitTypeLinkingModal from '@/widget/Modal/UnitTypeLinkingModal';
import UnitTypeCategoryModal from '@/widget/Modal/UnitTypeCategoryModal';
import RemoveConfirmModal from '@/widget/Modal/RemoveConfirmModal';
import LockScheduleConfirmModal from '@/widget/Modal/LockScheduleConfirmModal';
import LockScheduleDateModal from '@/widget/Modal/LockScheduleDateModal';

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
  const { data: unitTypes, isLoading: unitTypesLoading } = useGetUnitTypesQuery(facilityId);
  const [updateUnitType, { isLoading: isUpdatingUnitType }] = useUpdateUnitTypeMutation();

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

      // Find the selected unit type to get its name
      const selectedUnitType = unitTypes?.find((ut) => ut.id === linkData.unitTypeId);

      const updatedUnit = {
        ...selectedUnit,
        exception: true,
        master_unittype: linkData.unitTypeId,
        master_unittype_name: selectedUnitType?.unit_type || '',
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
        scroll={{ x: 1200 }}
        locale={{
          emptyText: 'No unit types available for this facility',
        }}
      />

      {/* Initial Link or Anchor Modal */}
      <LinkOrAnchorModal
        open={linkOrAnchorModalOpen}
        onCancel={() => {
          setLinkOrAnchorModalOpen(false);
          setSelectedUnit(null);
        }}
        onLinkClick={() => {
          setLinkOrAnchorModalOpen(false);
          setLinkModalOpen(true);
        }}
        onAnchorClick={() => {
          setLinkOrAnchorModalOpen(false);
          setCategoryModalOpen(true);
        }}
      />

      {/* Unit Type Linking Modal */}
      <UnitTypeLinkingModal
        open={linkModalOpen}
        onCancel={() => {
          setLinkModalOpen(false);
          setSelectedUnit(null);
        }}
        onConfirm={saveUnitTypeLink}
        linkData={linkData}
        onLinkDataChange={setLinkData}
        selectedUnit={selectedUnit}
        unitTypes={unitTypes}
        loading={isUpdatingUnitType}
        unitTypesLoading={unitTypesLoading}
      />

      {/* Unit Type Category (Anchor) Modal */}
      <UnitTypeCategoryModal
        open={categoryModalOpen}
        onCancel={() => {
          setCategoryModalOpen(false);
          setSelectedUnit(null);
        }}
        onConfirm={saveUnitTypeCategory}
        categoryData={categoryData}
        onCategoryDataChange={setCategoryData}
        selectedUnit={selectedUnit}
        loading={isUpdatingUnitType}
      />

      {/* Remove Confirmation Modal */}
      <RemoveConfirmModal
        open={removeConfirmModalOpen}
        onCancel={() => {
          setRemoveConfirmModalOpen(false);
          setSelectedUnit(null);
        }}
        onConfirm={handleRemoveUnitType}
        selectedUnit={selectedUnit}
        loading={isUpdatingUnitType}
      />

      {/* Lock Schedule Confirmation Modal */}
      <LockScheduleConfirmModal
        open={lockScheduleConfirmModalOpen}
        onCancel={() => {
          setLockScheduleConfirmModalOpen(false);
          setUnitToLock(null);
        }}
        onLockNow={() => {
          if (unitToLock) {
            handleLockUnitRate(unitToLock, true);
          }
        }}
        onSchedule={handleScheduleLock}
        unitToLock={unitToLock}
      />

      {/* Lock Schedule Date Modal */}
      <LockScheduleDateModal
        open={lockScheduleModalOpen}
        onCancel={() => {
          setLockScheduleModalOpen(false);
          setLockExpirationDate(null);
          setUnitToLock(null);
        }}
        onConfirm={confirmScheduledLock}
        lockExpirationDate={lockExpirationDate}
        onDateChange={(date) => setLockExpirationDate(date)}
        unitToLock={unitToLock}
      />
    </>
  );
};

export default UnitTypeStatistics;
