import { Modal, Button, Space } from 'antd';
import './LinkOrAnchorModal.less';

const LinkOrAnchorModal = ({ open, onCancel, onLinkClick, onAnchorClick }) => {
  return (
    <Modal
      title="Link or Anchor Unit?"
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={400}
    >
      <div className="link-anchor-modal-content">
        <p className="link-anchor-modal-description">
          Choose how you want to handle this unit type:
        </p>
        <Space size="large" className="link-anchor-modal-buttons">
          <Button
            type="default"
            size="large"
            onClick={onLinkClick}
            className="link-anchor-modal-button link-button"
          >
            LINK
          </Button>
          <Button
            type="default"
            size="large"
            onClick={onAnchorClick}
            className="link-anchor-modal-button anchor-button"
          >
            ANCHOR
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default LinkOrAnchorModal;
