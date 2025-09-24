import { Input, Button, Space, Typography, Tag, Tooltip, Flex, Checkbox } from 'antd';
import {
  EditOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { formatCurrency } from '@/utils/formatters';
import { getSecondaryUnitTypeLabel } from '@/utils/unitHelpers';

const { Text } = Typography;

/**
 * Get all columns for UnitTypeStatistics table
 * @param {Object} props - Column configuration props
 * @returns {Array} Complete columns array for the table
 */
export const getUnitTypeStatisticsTableColumns = ({
  rateType,
  pmsType,
  changedUnits = [],
  editingUnit,
  setEditingUnit,
  setSelectedUnit,
  setLinkOrAnchorModalOpen,
  setRemoveConfirmModalOpen,
  handleRateChange,
  handleLockToggle,
  setUnitToLock,
  setLockExpirationDate,
  setLockScheduleModalOpen,
}) => {
  return [
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
};
