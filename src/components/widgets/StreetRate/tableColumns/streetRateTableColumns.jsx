import { Button, Flex, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { formatPercent, formatCurrency } from '@/utils/formatters';

const { Text } = Typography;

export const getStreetRateTableColumns = ({
  expandedRowKeys,
  changedUnits,
  savedRateUnits,
  handleSaveChanges,
  handleClose,
  handleExpand,
  handlePublishIndividual,
  isSavingChanges,
}) => {
  const navigate = useNavigate();

  return [
    // Facility Column
    {
      title: 'Facility',
      dataIndex: 'facility_name',
      key: 'facility_name',
      width: 250,
      sorter: true,
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

    // Market Column
    {
      title: 'Market',
      dataIndex: 'market',
      key: 'market',
      width: 140,
      sorter: true,
    },

    // Physical Occupancy Column
    {
      title: 'Physical Occupancy %',
      dataIndex: 'physical_occupancy',
      key: 'physical_occupancy',
      width: 140,
      align: 'center',
      sorter: true,
      render: (value) => (value != null ? `${parseFloat(value).toFixed(2)}%` : '0.00%'),
    },

    {
      title: 'New',
      className: 'new-group-header',
      children: [
        // Average Rate Change Percentage Column
        {
          title: 'Avg Rate Change %',
          dataIndex: 'avr_rate_change_percent',
          key: 'avr_rate_change_percent',
          width: 130,
          align: 'center',
          className: 'new-group-header',
          sorter: true,
          render: (value) => {
            if (value == null) return '0.00%';
            const numValue = parseFloat(value);
            const color = numValue >= 0 ? '#52c41a' : '#ff4d4f';
            return <span style={{ color }}>{formatPercent(numValue / 100)}</span>;
          },
        },

        // Average Rate Change Amount Column
        {
          title: 'Avg Rate Change $',
          dataIndex: 'avr_rate_change_amount',
          key: 'avr_rate_change_amount',
          width: 130,
          align: 'center',
          className: 'new-group-header',
          sorter: true,
          render: (value) => {
            if (value == null) return '$0.00';
            const numValue = parseFloat(value);
            const color = numValue >= 0 ? '#52c41a' : '#ff4d4f';
            return <span style={{ color }}>{formatCurrency(numValue)}</span>;
          },
        },

        // Largest Increase Column
        {
          title: 'Largest Increase',
          dataIndex: 'largest_increase',
          key: 'largest_increase',
          width: 120,
          align: 'center',
          className: 'new-group-header',
          sorter: true,
          render: (value) => (value != null ? formatCurrency(value) : '$0.00'),
        },

        // Largest Decrease Column
        {
          title: 'Largest Decrease',
          dataIndex: 'largest_decrease',
          key: 'largest_decrease',
          width: 120,
          align: 'center',
          className: 'new-group-header',
          sorter: true,
          render: (value) => (value != null ? formatCurrency(value) : '$0.00'),
        },
      ],
    },

    // Actions Column
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
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
              size="small"
              onClick={() =>
                isExpanded
                  ? hasChanges
                    ? handleSaveChanges(record)
                    : handleClose(record)
                  : handleExpand(true, record)
              }
              variant={isExpanded ? 'solid' : 'outlined'}
              color={isExpanded ? 'danger' : 'default'}
              loading={isExpanded && hasChanges && isSavingChanges}
              disabled={isExpanded && hasChanges && isSavingChanges}
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
              size="small"
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
};
