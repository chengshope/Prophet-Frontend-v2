import { Form, Segmented, Select, TimePicker } from 'antd';
import { SoundOutlined, BulbOutlined, ClockCircleOutlined, MailOutlined } from '@ant-design/icons';
import SettingGroup from '@/components/common/SettingGroup';
import FormLabel from '@/components/common/FormLabel';

const { Option } = Select;

const WEEKDAY_OPTIONS = [
  { label: 'Monday', value: 'Mon' },
  { label: 'Tuesday', value: 'Tue' },
  { label: 'Wednesday', value: 'Wed' },
  { label: 'Thursday', value: 'Thu' },
  { label: 'Friday', value: 'Fri' },
  { label: 'Saturday', value: 'Sat' },
  { label: 'Sunday', value: 'Sun' },
];

const StreetRateUpdateStrategy = ({ frequency, handleFrequencyChange }) => {
  return (
    <SettingGroup
      title="Street Rate Update Strategy"
      description="Configure when and how street rates should be updated."
    >
      <Form.Item
        label={<FormLabel icon={<SoundOutlined />} label="Frequency" iconColor="#fa8c16" />}
        name="frequency"
      >
        <Segmented
          size="middle"
          value={frequency}
          onChange={handleFrequencyChange}
          options={[
            { label: 'Daily', value: 'Daily' },
            { label: 'Weekly', value: 'Weekly' },
            { label: 'Monthly', value: 'Monthly' },
          ]}
        />
      </Form.Item>

      {frequency === 'Weekly' && (
        <Form.Item
          label={<FormLabel icon={<BulbOutlined />} label="Day of Week" iconColor="#fa8c16" />}
          name="weekday"
        >
          <Segmented size="middle" options={WEEKDAY_OPTIONS} />
        </Form.Item>
      )}

      {/* Day of Month - only show for Monthly frequency */}
      {frequency === 'Monthly' && (
        <Form.Item
          label={<FormLabel icon={<BulbOutlined />} label="Day of Month" iconColor="#fa8c16" />}
          name="dayOfMonth"
        >
          <Select size="middle" style={{ width: 300 }}>
            {Array.from({ length: 31 }, (_, i) => (
              <Option key={i + 1} value={i + 1}>
                {i + 1}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}

      <Form.Item
        label={
          <FormLabel
            icon={<ClockCircleOutlined />}
            label="Time of Day"
            tooltip="Set the time when updates should be executed."
            iconColor="#fa8c16"
          />
        }
        name="timeOfDay"
        className="full-width-picker"
      >
        <TimePicker format="HH:mm" size="middle" style={{ width: 300 }} />
      </Form.Item>

      <Form.Item
        label={
          <FormLabel
            icon={<MailOutlined />}
            label="Notification Emails"
            tooltip="Hit ENTER to add a new email."
            iconColor="#fa8c16"
          />
        }
        name="emails"
        style={{ marginBottom: 0 }}
      >
        <Select
          size="middle"
          mode="tags"
          tokenSeparators={[',']}
          placeholder="Add email and press Enter"
          style={{ width: '100%' }}
        />
      </Form.Item>
    </SettingGroup>
  );
};

export default StreetRateUpdateStrategy;
