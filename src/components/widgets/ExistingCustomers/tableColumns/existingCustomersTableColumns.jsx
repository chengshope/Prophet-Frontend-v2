import { Space, Tag, Typography, Button, Flex } from 'antd';
import { useSelector } from 'react-redux';
import { getMoveOutProbabilityColor } from '@/utils/config';
import {
  selectNewTenantChanges,
  getFacilityHasSavedChanges,
} from '@/features/existingCustomers/existingCustomersSelector';

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
    width: 200,
    render: (value, record) => (
      <Space direction="vertical" size={0}>
        <Text strong>{value}</Text>
        <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>ID: {record.facility_id}</Text>
      </Space>
    ),
  },
  {
    title: 'Market',
    dataIndex: 'market',
    key: 'market',
    sorter: true,
    width: 150,
    render: (_, record) => `${record.city}, ${record.state}`,
  },
  {
    title: 'Eligible Tenants',
    dataIndex: 'tenants',
    key: 'eligible_tenants',
    sorter: true,
    align: 'center',
    width: 120,
    render: (tenants) => tenants.length || 0,
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
        width: 150,
        render: (value) => {
          const percentage = value || 0;
          const color = percentage >= 0 ? '#52c41a' : '#ff4d4f';
          const sign = percentage >= 0 ? '+' : '';
          return (
            <span style={{ color }}>
              {sign}
              {percentage.toFixed(2)}%
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
        width: 150,
        render: (value) => {
          const avgChange = value || 0;
          const color = avgChange >= 0 ? '#52c41a' : '#ff4d4f';
          const sign = avgChange >= 0 ? '+' : '';
          return (
            <span style={{ color }}>
              {sign}${avgChange.toFixed(2)}
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
        width: 120,
        render: (value) => {
          const amount = value || 0;
          return `$${amount.toFixed(2)}`;
        },
      },
      {
        title: 'Average Move-Out Probability',
        dataIndex: 'avr_moveout_probability',
        key: 'avr_moveout_probability',
        sorter: true,
        align: 'center',
        className: 'new-group-header',
        width: 180,
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
    width: 140,
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
