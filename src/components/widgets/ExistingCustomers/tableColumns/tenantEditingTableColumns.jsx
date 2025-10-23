import { formatCurrency } from '@/utils/formatters';
import { EditOutlined } from '@ant-design/icons';
import { Button, Checkbox, Input, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { getMoveOutProbabilityColor } from '../../../../utils/config';

const { Text } = Typography;

export const getTenantEditingTableColumns = ({
  editingTenants,
  editingTenantId,
  setEditingTenantId,
  handleFieldChange,
}) => {
  const showCurrentRateColor = (tenant) => {
    if (tenant.current_rate === tenant.std_rate) {
      return '';
    }

    return tenant.current_rate > tenant.std_rate ? '#52c41a' : '#ff4d4f';
  };

  return [
    {
      title: 'Tenant Name/Unit',
      key: 'tenant_name',
      width: 180,
      render: (_, tenant) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
            {tenant.tenant_fname} {tenant.tenant_lname}
          </div>
          <div style={{ fontSize: '11px', color: '#8c8c8c' }}>{tenant.unit_no}</div>
        </div>
      ),
    },
    {
      title: 'Unit Type',
      dataIndex: 'unit_type',
      key: 'unit_type',
      width: 120,
      align: 'center',
      render: (value) => value || '-',
    },
    {
      title: 'Current Tenant Rate',
      dataIndex: 'current_rate',
      key: 'current_rate',
      width: 130,
      align: 'center',
      render: (value, tenant) => (
        <div style={{ color: showCurrentRateColor(tenant) }}>{formatCurrency(value || 0)}</div>
      ),
    },
    {
      title: "Today's Street Rate",
      dataIndex: 'std_rate',
      key: 'street_rate',
      width: 130,
      align: 'center',
      render: (value) => formatCurrency(value || 0),
    },
    {
      title: 'Street Rate Delta',
      key: 'street_rate_delta',
      width: 130,
      align: 'center',
      render: (_, tenant) => {
        const delta = (tenant.current_rate || 0) - (tenant.std_rate || 0);
        const color = delta >= 0 ? '#52c41a' : '#ff4d4f';
        const sign = delta >= 0 ? '+' : '';
        return (
          <span style={{ color }}>
            {sign}
            {formatCurrency(delta)}
          </span>
        );
      },
    },
    {
      title: 'Move-Out Probability',
      dataIndex: 'move_out_probability',
      key: 'moveout_probability',
      width: 150,
      align: 'center',
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
    {
      title: 'Previously Increased',
      key: 'previously_increased',
      width: 120,
      align: 'center',
      render: (_, tenant) =>
        dayjs(tenant.move_in_date).isBefore(dayjs(tenant.last_ecri_date)) ? 'Yes' : 'No',
    },
    {
      title: 'Last Increase Date',
      dataIndex: 'last_ecri_date',
      key: 'last_increase_date',
      width: 120,
      align: 'center',
      render: (value) => moment(value).format('M/D/YY'),
    },
    {
      title: 'Rate Increase $',
      dataIndex: 'increase_amount',
      key: 'rate_increase_dollar',
      width: 130,
      align: 'center',
      render: (value) => <div>${value.toFixed(2)}</div>,
    },
    {
      title: 'Rate Increase %',
      dataIndex: 'increase_percentage',
      key: 'rate_increase',
      width: 130,
      align: 'center',
      render: (value) => <div>{(value * 100.0).toFixed(2)}%</div>,
    },
    {
      title: 'Effective Date',
      dataIndex: 'effective_date',
      key: 'effective_date',
      width: 120,
      align: 'center',
      render: (date) => {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
        });
      },
    },
    {
      title: 'New Rate',
      dataIndex: 'new_rate',
      key: 'new_rate',
      width: 160,
      align: 'center',
      render: (_, tenant) => {
        const isEditing = editingTenantId === tenant.ecri_id;
        const currentValue = editingTenants[tenant.ecri_id]?.new_rate || tenant.current_rate;
        const hasChanged = editingTenants[tenant.ecri_id]?.new_rate !== tenant.current_rate;
        const isExcluded = tenant.exclude_submit;

        if (isExcluded) {
          return <Text style={{ color: '#8c8c8c' }}>{formatCurrency(currentValue)}</Text>;
        }

        if (isEditing) {
          return (
            <Input
              type="number"
              size="small"
              step="0.01"
              min="0"
              defaultValue={currentValue}
              onPressEnter={(e) => {
                const newRate = parseFloat(e.target.value) || 0;
                handleFieldChange(tenant, 'new_rate', newRate);
                setEditingTenantId(null);
              }}
              onBlur={(e) => {
                const newRate = parseFloat(e.target.value) || 0;
                handleFieldChange(tenant, 'new_rate', newRate);
                setEditingTenantId(null);
              }}
              autoFocus
              style={{ width: '100%' }}
              prefix="$"
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
              onClick={() => setEditingTenantId(tenant.ecri_id)}
              style={{ padding: 0 }}
            />
          </Space>
        );
      },
    },
    {
      title: 'Exclude',
      key: 'exclude_submit',
      width: 80,
      align: 'center',
      render: (_, tenant) => {
        const currentValue = editingTenants[tenant.ecri_id]?.exclude_submit || false;
        return (
          <Checkbox
            checked={currentValue}
            onChange={(e) => handleFieldChange(tenant, 'exclude_submit', e.target.checked)}
          />
        );
      },
    },
  ];
};
