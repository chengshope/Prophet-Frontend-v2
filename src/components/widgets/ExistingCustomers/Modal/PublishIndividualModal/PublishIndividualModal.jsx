import { Modal, Typography } from 'antd';

const { Text } = Typography;

/**
 * Modal for confirming publishing individual facility rate changes
 * Following Rule #4: Modal components under ExistingCustomers/Modal/
 */
const PublishIndividualModal = ({
  open,
  onOk,
  onCancel,
  confirmLoading,
  selectedFacility = null,
  savedTenantChangesCount = 0,
}) => {
  return (
    <Modal
      title={`Publish Rate Changes - ${selectedFacility?.facility_name || ''}`}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
    >
      <p>Are you sure you want to publish saved rate changes for this facility?</p>
      <p>
        <Text type="secondary">{savedTenantChangesCount} saved changes will be published.</Text>
      </p>
    </Modal>
  );
};

export default PublishIndividualModal;
