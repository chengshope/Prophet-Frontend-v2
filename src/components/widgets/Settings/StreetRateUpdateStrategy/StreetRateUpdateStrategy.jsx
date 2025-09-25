import { Form, Segmented, Select, TimePicker } from 'antd';
import { SoundOutlined, BulbOutlined, ClockCircleOutlined, MailOutlined } from '@ant-design/icons';
import SettingGroup from '@/components/common/SettingGroup';
import FormLabel from '@/components/common/FormLabel';
import { WEEKDAY_OPTIONS, FREQUENCY_OPTIONS } from '@/constants';

const { Option } = Select;

const StreetRateUpdateStrategy = ({ frequency, handleFrequencyChange, loading = false }) => {
  return (
    <SettingGroup
      title="Street Rate Update Strategy"
      description="Configure when and how street rates should be updated."
      loading={loading}
    >
      <Form.Item
        label={<FormLabel icon={<SoundOutlined />} label="Frequency" iconColor="#fa8c16" />}
        name="frequency"
      >
        <Segmented
          size="middle"
          value={frequency}
          onChange={handleFrequencyChange}
          options={FREQUENCY_OPTIONS.map(freq => ({ label: freq, value: freq }))}
        />
      </Form.Item>

      {frequency === FREQUENCY_OPTIONS[1] && (
        <Form.Item
          label={<FormLabel icon={<BulbOutlined />} label="Day of Week" iconColor="#fa8c16" />}
          name="weekday"
        >
          <Segmented size="middle" options={WEEKDAY_OPTIONS} />
        </Form.Item>
      )}

      {/* Day of Month - only show for Monthly frequency */}
      {frequency === FREQUENCY_OPTIONS[2] && (
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
