import { Modal, Typography } from 'antd';

const { Text } = Typography;

/**
 * Modal for confirming user deletion
 * Following Rule #4: Modal components under Portfolio/Modal/
 */
const DeleteUserModal = ({ open, onOk, onCancel, confirmLoading, selectedUser = null }) => {
  return (
    <Modal
      title="Delete User"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okText="Delete"
      okType="danger"
      cancelText="Cancel"
    >
      <p>Are you sure you want to delete this user?</p>
      {selectedUser && (
        <p>
          <Text strong>
            {selectedUser.first_name} {selectedUser.last_name}
          </Text>
          <br />
          <Text type="secondary">{selectedUser.email}</Text>
        </p>
      )}
      <p>
        <Text type="warning">This action cannot be undone.</Text>
      </p>
    </Modal>
  );
};

export default DeleteUserModal;
