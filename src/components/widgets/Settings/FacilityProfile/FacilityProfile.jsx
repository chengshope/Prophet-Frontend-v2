import { Form, Segmented } from 'antd';
import SettingGroup from '@/components/common/SettingGroup';
import { showError, showSuccess } from '@/utils/messageService';
import { useToggleFacilityProfileMutation } from '@/api/settingsApi';

const FacilityProfile = ({ facilityId }) => {
  const [toggleFacilityProfile] = useToggleFacilityProfileMutation();

  // Handle profile toggle (immediate save like v1)
  const handleProfileToggle = async () => {
    try {
      await toggleFacilityProfile(facilityId).unwrap();
      showSuccess('Facility profile updated successfully!');
    } catch (error) {
      console.error('Profile toggle error:', error);
      showError('Failed to update facility profile');
    }
  };

  return (
    <SettingGroup title="Profile" description="Select the facility profile type.">
      <Form.Item name="profile" style={{ marginBottom: 0 }}>
        <Segmented
          size="middle"
          options={[
            { label: 'Stabilized', value: 'stabilized' },
            { label: 'Lease Up', value: 'leaseup' },
          ]}
          onChange={handleProfileToggle}
        />
      </Form.Item>
    </SettingGroup>
  );
};

export default FacilityProfile;
