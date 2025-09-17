import { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Tooltip,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useUpdateCompetitorMutation } from '@/api/competitorsApi';

const { Option } = Select;

const CompetitorsTable = ({ data, loading, selectedFacility, onCompetitorUpdate }) => {
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [sortColumn, setSortColumn] = useState('store_name');
  const [sortDirection, setSortDirection] = useState('asc');

  const [updateCompetitor, { isLoading: isUpdating }] = useUpdateCompetitorMutation();

  // Check if a row is being edited
  const isEditing = (record) => record.id === editingKey;

  // Start editing a row
  const edit = (record) => {
    form.setFieldsValue({
      store_name: record.store_name,
      address: record.address,
      phone: record.phone,
      website: record.website,
      distance: record.distance,
      unit_type: record.unit_type,
      size: record.size,
      rate: record.rate,
      climate_controlled: record.climate_controlled,
      notes: record.notes,
    });
    setEditingKey(record.id);
  };

  // Cancel editing
  const cancel = () => {
    setEditingKey('');
    form.resetFields();
  };

  // Save changes
  const save = async (id) => {
    try {
      const values = await form.validateFields();

      await updateCompetitor({
        competitorId: id,
        ...values,
      }).unwrap();

      setEditingKey('');
      message.success('Competitor updated successfully');
      onCompetitorUpdate();
    } catch (error) {
      console.error('Error updating competitor:', error);
      message.error('Failed to update competitor');
    }
  };

  // Handle table sorting
  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter && sorter.field) {
      setSortColumn(sorter.field);
      setSortDirection(sorter.order === 'ascend' ? 'asc' : 'desc');
    }
  };

  // Sort data
  const sortedData = [...(data || [])].sort((a, b) => {
    const aValue = a[sortColumn] || '';
    const bValue = b[sortColumn] || '';

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (sortDirection === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  // Table columns
  const columns = [
    {
      title: 'Store Name',
      dataIndex: 'store_name',
      key: 'store_name',
      sorter: true,
      sortOrder:
        sortColumn === 'store_name' ? (sortDirection === 'asc' ? 'ascend' : 'descend') : null,
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="store_name"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Store name is required' }]}
          >
            <Input />
          </Form.Item>
        ) : (
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            {record.address && (
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.address}</div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Distance (mi)',
      dataIndex: 'distance',
      key: 'distance',
      sorter: true,
      sortOrder:
        sortColumn === 'distance' ? (sortDirection === 'asc' ? 'ascend' : 'descend') : null,
      align: 'center',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item name="distance" style={{ margin: 0 }}>
            <InputNumber min={0} step={0.1} precision={1} style={{ width: '100%' }} />
          </Form.Item>
        ) : (
          <span>{text ? `${parseFloat(text).toFixed(1)} mi` : 'N/A'}</span>
        );
      },
    },
    {
      title: 'Unit Type',
      dataIndex: 'unit_type',
      key: 'unit_type',
      sorter: true,
      sortOrder:
        sortColumn === 'unit_type' ? (sortDirection === 'asc' ? 'ascend' : 'descend') : null,
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item name="unit_type" style={{ margin: 0 }}>
            <Input />
          </Form.Item>
        ) : (
          <span>{text || 'N/A'}</span>
        );
      },
    },
    {
      title: 'Size (sq ft)',
      dataIndex: 'size',
      key: 'size',
      sorter: true,
      sortOrder: sortColumn === 'size' ? (sortDirection === 'asc' ? 'ascend' : 'descend') : null,
      align: 'center',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item name="size" style={{ margin: 0 }}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        ) : (
          <span>{text ? `${text} sq ft` : 'N/A'}</span>
        );
      },
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      sorter: true,
      sortOrder: sortColumn === 'rate' ? (sortDirection === 'asc' ? 'ascend' : 'descend') : null,
      align: 'center',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item name="rate" style={{ margin: 0 }}>
            <InputNumber min={0} step={0.01} precision={2} prefix="$" style={{ width: '100%' }} />
          </Form.Item>
        ) : (
          <span>{text ? `$${parseFloat(text).toFixed(2)}` : 'N/A'}</span>
        );
      },
    },
    {
      title: 'Climate Controlled',
      dataIndex: 'climate_controlled',
      key: 'climate_controlled',
      align: 'center',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item name="climate_controlled" style={{ margin: 0 }}>
            <Select style={{ width: '100%' }}>
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>
        ) : (
          <Tag color={text ? 'green' : 'red'}>{text ? 'Yes' : 'No'}</Tag>
        );
      },
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Form.Item name="phone" style={{ margin: 0 }}>
              <Input placeholder="Phone" />
            </Form.Item>
            <Form.Item name="website" style={{ margin: 0 }}>
              <Input placeholder="Website" />
            </Form.Item>
          </Space>
        ) : (
          <Space direction="vertical" size="small">
            {record.phone && <div style={{ fontSize: '12px' }}>📞 {record.phone}</div>}
            {record.website && (
              <div style={{ fontSize: '12px' }}>
                🌐{' '}
                <a href={record.website} target="_blank" rel="noopener noreferrer">
                  Website
                </a>
              </div>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Tooltip title="Save">
              <Button
                type="primary"
                size="small"
                icon={<SaveOutlined />}
                onClick={() => save(record.id)}
                loading={isUpdating}
              />
            </Tooltip>
            <Tooltip title="Cancel">
              <Button size="small" icon={<CloseOutlined />} onClick={cancel} />
            </Tooltip>
          </Space>
        ) : (
          <Tooltip title="Edit">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => edit(record)}
              disabled={editingKey !== ''}
            />
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Form form={form} component={false}>
      <Table
        columns={columns}
        dataSource={sortedData}
        loading={loading}
        onChange={handleTableChange}
        rowKey="id"
        size="middle"
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} competitors`,
        }}
      />
    </Form>
  );
};

export default CompetitorsTable;
