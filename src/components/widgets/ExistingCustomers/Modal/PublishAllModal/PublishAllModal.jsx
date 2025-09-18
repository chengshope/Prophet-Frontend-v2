import { Modal, Typography } from 'antd';

const { Text } = Typography;

/**
 * Modal for confirming publishing all rate changes
 * Following Rule #4: Modal components under ExistingCustomers/Modal/
 */
const PublishAllModal = ({
  open,
  onOk,
  onCancel,
  confirmLoading,
  savedEcriIds = [],
  facilitiesWithChangesCount = 0,
}) => {
  return (
    <Modal
      title="Publish All Rate Changes"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
    >
      <p>Are you sure you want to publish all saved rate changes?</p>
      <p>
        <Text strong>{savedEcriIds.length}</Text> saved changes will be published across{' '}
        <Text strong>{facilitiesWithChangesCount}</Text> facilities.
      </p>
    </Modal>
  );
};

export default PublishAllModal;
