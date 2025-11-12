import {
  getFacilityHasSavedChanges,
  selectNewTenantChanges,
} from '@/features/existingCustomers/existingCustomersSelector';
import { getMoveOutProbabilityColor } from '@/utils/config';
import { Button, Flex, Space, Tag, Typography } from 'antd';
import { useSelector } from 'react-redux';

const { Text } = Typography;

export const getExistingCustomersTableColumns = ({
  expandedRowKeys = [],
  onExpand,
  onClose,
  onSaveChanges,
  onPublish,
  navigate,
}) => [
  {
    title: 'Facility',
    dataIndex: 'facility_name',
    key: 'facility_name',
    sorter: true,
    render: (value, record) => (
      <Space direction="vertical" size={0}>
        <Text strong>{value}</Text>
        <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>{record.address}</Text>
      </Space>
    ),
  },
  {
    title: 'Market',
    dataIndex: 'market',
    key: 'market',
    sorter: true,
    render: (_, record) => `${record.city}, ${record.state}`,
  },
  {
    title: 'Eligible Tenants',
    dataIndex: 'tenants',
    key: 'eligible_tenants',
    sorter: true,
    align: 'center',
    render: (tenants) => (tenants?.length ? tenants.length.toLocaleString() : '0'),
  },
  {
    title: 'New',
    className: 'new-group-header',
    children: [
      {
        title: 'Average Rate Increase %',
        dataIndex: 'avr_rate_increase_percent',
        key: 'avr_rate_increase_percent',
        sorter: true,
        align: 'center',
        className: 'new-group-header',
        render: (value) => {
          const percentage = Number(value) || 0;
          const color = percentage >= 0 ? '#52c41a' : '#ff4d4f';
          const sign = percentage >= 0 ? '+' : '';
          const formatted = percentage.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          return (
            <span style={{ color }}>
              {sign}
              {formatted}%
            </span>
          );
        },
      },
      {
        title: 'Average Rate Change $',
        dataIndex: 'avr_rate_increase_amount',
        key: 'avr_rate_increase_amount',
        sorter: true,
        align: 'center',
        className: 'new-group-header',
        render: (value) => {
          const avgChange = Number(value) || 0;
          const color = avgChange >= 0 ? '#52c41a' : '#ff4d4f';
          const sign = avgChange >= 0 ? '+' : '';
          const formatted = avgChange.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          return (
            <span style={{ color }}>
              {sign}${formatted}
            </span>
          );
        },
      },
      {
        title: 'Largest Increase',
        dataIndex: 'largest_rate_increase',
        key: 'largest_increase',
        sorter: true,
        align: 'center',
        className: 'new-group-header',
        render: (value) => {
          const amount = Number(value) || 0;
          return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        },
      },
      {
        title: 'Average Move-Out Probability',
        dataIndex: 'avr_moveout_probability',
        key: 'avr_moveout_probability',
        sorter: true,
        align: 'center',
        className: 'new-group-header',
        render: (value) => {
          const percentage = value * 100 || 0;
          const color = getMoveOutProbabilityColor(percentage);
          return (
            <Tag color={color} style={{ color: 'black' }}>
              {percentage.toFixed(1)}%
            </Tag>
          );
        },
      },
    ],
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 160,
    fixed: 'right',
    align: 'center',
    render: (_, record) => (
      <FacilityActions
        facility={record}
        isExpanded={expandedRowKeys.includes(record.facility_id)}
        onExpand={onExpand}
        onClose={onClose}
        onSaveChanges={onSaveChanges}
        onPublish={onPublish}
        navigate={navigate}
      />
    ),
  },
];

const FacilityActions = ({ facility, isExpanded, onExpand, onClose, onSaveChanges, onPublish }) => {
  const newTenantChanges = useSelector(selectNewTenantChanges);
  const hasChanges = newTenantChanges.some((tenant) =>
    facility.tenants?.some((facilityTenant) => facilityTenant.ecri_id === tenant.ecri_id)
  );
  const hasSavedTenantChanges = useSelector((state) =>
    getFacilityHasSavedChanges(state, facility.facility_id)
  );

  return (
    <Flex vertical={true} gap={10} style={{ padding: '0 8px' }}>
      <Button
        size="small"
        onClick={() =>
          isExpanded
            ? hasChanges
              ? onSaveChanges(facility)
              : onClose(facility)
            : onExpand(true, facility)
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
            : 'Review Increases'}
      </Button>
      {!isExpanded && (
        <Button
          size="small"
          variant="outlined"
          color="default"
          disabled={!isExpanded && !hasSavedTenantChanges}
          onClick={() => onPublish(facility)}
          block
        >
          Publish Rates
        </Button>
      )}
    </Flex>
  );
};
