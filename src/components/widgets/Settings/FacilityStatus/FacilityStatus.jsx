import { Form, Segmented } from 'antd';
import SettingGroup from '@/components/common/SettingGroup';
import { showError, showSuccess } from '@/utils/messageService';
import { useToggleFacilityStatusMutation } from '@/api/settingsApi';

const FacilityStatus = ({ facilitySettings, facilityId }) => {
  const [toggleFacilityStatus] = useToggleFacilityStatusMutation();

  // Handle status toggle (immediate save like v1)
  const handleStatusToggle = async (value) => {
    try {
      await toggleFacilityStatus(facilityId).unwrap();
      showSuccess('Facility status updated successfully!');
    } catch (error) {
      console.error('Status toggle error:', error);
      showError('Failed to update facility status');
    }
  };

  return (
    <SettingGroup title="Status" description="Enable or disable this facility.">
      <Form.Item name="status" style={{ marginBottom: 0 }}>
        <Segmented
          size="middle"
          options={[
            { label: 'Enabled', value: 'enabled' },
            { label: 'Disabled', value: 'disabled' },
          ]}
          onChange={handleStatusToggle}
        />
      </Form.Item>
    </SettingGroup>
  );
};

export default FacilityStatus;
