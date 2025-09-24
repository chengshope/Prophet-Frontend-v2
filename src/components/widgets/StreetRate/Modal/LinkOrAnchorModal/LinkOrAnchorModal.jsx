import { Modal, Button } from 'antd';
import './LinkOrAnchorModal.less';

const LinkOrAnchorModal = ({ open, onCancel, onLinkClick, onAnchorClick }) => {
  return (
    <Modal
      title="Link or Anchor Unit?"
      open={open}
      onCancel={onCancel}
      footer={
        <div className="link-anchor-modal-footer">
          <Button onClick={onLinkClick} className="link-button">
            Link
          </Button>
          <Button type="primary" onClick={onAnchorClick} className="anchor-button">
            Anchor
          </Button>
        </div>
      }
      centered
      width={400}
    >
      <div className="link-anchor-modal-content">
        <p className="link-anchor-modal-description">
          Choose how you want to handle this unit type:
        </p>
      </div>
    </Modal>
  );
};

export default LinkOrAnchorModal;
