import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Space } from 'antd';

const AddUserModal = ({ open, onCancel, onSubmit, loading, form }) => {
  return (
    <Modal title="Add New User" open={open} onCancel={onCancel} footer={null} width={500}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: 'First Name is required' }]}
        >
          <Input placeholder="First Name" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: 'Last Name is required' }]}
        >
          <Input placeholder="Last Name" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email format' },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={loading}>
              Add User
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
