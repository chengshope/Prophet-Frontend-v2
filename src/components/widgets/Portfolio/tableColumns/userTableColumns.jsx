import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export const getUserTableColumns = (onDeleteUser) => [
  {
    title: '#',
    key: 'index',
    render: (_, __, index) => index + 1,
    width: 60,
    align: 'center',
  },
  {
    title: 'Full Name',
    key: 'fullName',
    render: (_, record) => `${record.first_name} ${record.last_name}`,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Action',
    key: 'action',
    align: 'center',
    width: 150,
    render: (_, record) => (
      <Button
        variant="dashed"
        color="danger"
        size="small"
        shape="circle"
        icon={<DeleteOutlined />}
        onClick={() => onDeleteUser(record)}
      />
    ),
  },
];
