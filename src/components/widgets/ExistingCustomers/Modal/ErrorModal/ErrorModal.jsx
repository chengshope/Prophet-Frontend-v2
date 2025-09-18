import { Modal, Button } from 'antd';

/**
 * Modal for displaying error messages
 * Following Rule #4: Modal components under ExistingCustomers/Modal/
 */
const ErrorModal = ({ open, onOk, onCancel, errorLog = '' }) => {
  return (
    <Modal
      title="Error"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button key="ok" type="primary" onClick={onOk}>
          OK
        </Button>,
      ]}
    >
      <p>{errorLog}</p>
    </Modal>
  );
};

export default ErrorModal;
