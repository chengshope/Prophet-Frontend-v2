import { Modal, Typography } from 'antd';

const { Text } = Typography;

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
