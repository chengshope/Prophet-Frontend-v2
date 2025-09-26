import { Form, Segmented } from 'antd';
import SettingGroup from '@/components/common/SettingGroup';
import { showSuccess } from '@/utils/messageService';
import { useToggleFacilityProfileMutation } from '@/api/settingsApi';

const FacilityProfile = ({ facilityId }) => {
  const [toggleFacilityProfile, { isLoading: isToggling }] = useToggleFacilityProfileMutation();

  const handleProfileToggle = async () => {
    try {
      await toggleFacilityProfile(facilityId).unwrap();
      showSuccess('Facility profile updated successfully!');
    } catch (error) {
      console.error('Profile toggle error:', error);
    }
  };

  return (
    <SettingGroup
      title="Profile"
      description="Select the facility profile type."
      loading={isToggling}
    >
      <Form.Item name="profile" style={{ marginBottom: 0 }}>
        <Segmented
          size="middle"
          options={[
            { label: 'Stabilized', value: 'stabilized' },
            { label: 'Lease Up', value: 'leaseup' },
          ]}
          onChange={handleProfileToggle}
          loading={isToggling}
          disabled={isToggling}
        />
      </Form.Item>
    </SettingGroup>
  );
};

export default FacilityProfile;
