import { Form, Segmented } from 'antd';
import SettingGroup from '@/components/common/SettingGroup';
import { showSuccess } from '@/utils/messageService';
import { useToggleFacilityStatusMutation } from '@/api/settingsApi';

const FacilityStatus = ({ facilityId }) => {
  const [toggleFacilityStatus, { isLoading: isToggling }] = useToggleFacilityStatusMutation();

  const handleStatusToggle = async () => {
    try {
      await toggleFacilityStatus(facilityId).unwrap();
      showSuccess('Facility status updated successfully!');
    } catch (error) {
      console.error('Status toggle error:', error);
    }
  };

  return (
    <SettingGroup
      title="Status"
      description="Enable or disable this facility."
      loading={isToggling}
    >
      <Form.Item name="status" style={{ marginBottom: 0 }}>
        <Segmented
          size="middle"
          options={[
            { label: 'Enabled', value: 'enabled' },
            { label: 'Disabled', value: 'disabled' },
          ]}
          onChange={handleStatusToggle}
          loading={isToggling}
          disabled={isToggling}
        />
      </Form.Item>
    </SettingGroup>
  );
};

export default FacilityStatus;
