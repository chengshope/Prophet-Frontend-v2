import { Form, InputNumber } from 'antd';
import {
  ClockCircleOutlined,
  DollarOutlined,
  PercentageOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import SettingGroup from '@/components/common/SettingGroup';
import FormLabel from '@/components/common/FormLabel';

const RateIncreaseCriteria = ({ scope, loading = false }) => {
  return (
    <SettingGroup
      title="Rate Increase Criteria"
      description="Configure the criteria and limits for automatic rate increases."
      loading={loading}
    >
      {scope === 'portfolio' && (
        <Form.Item
          label={
            <FormLabel
              icon={<ClockCircleOutlined />}
              label="Notification Days"
              tooltip="Number of days before rate change that notice is sent to customer"
              iconColor="#fa8c16"
            />
          }
          name="notificationDays"
          className="full-width-number"
        >
          <InputNumber min={0} style={{ width: 300 }} />
        </Form.Item>
      )}

      <Form.Item
        label={
          <FormLabel
            icon={<DollarOutlined />}
            label="Max Dollar Increase"
            tooltip="The maximum incremental dollar increase any one tenant may receive."
            iconColor="#52c41a"
          />
        }
        name="maxDollarIncrease"
        className="full-width-number"
      >
        <InputNumber min={0} addonBefore="$" style={{ width: 300 }} />
      </Form.Item>

      <Form.Item
        label={
          <FormLabel
            icon={<DollarOutlined />}
            label="Min Dollar Increase"
            tooltip="The minimum incremental dollar increase any one tenant may receive."
            iconColor="#52c41a"
          />
        }
        name="minDollarIncrease"
        className="full-width-number"
      >
        <InputNumber min={0} addonBefore="$" style={{ width: 300 }} />
      </Form.Item>

      <Form.Item
        label={
          <FormLabel
            icon={<PercentageOutlined />}
            label="Max Percent Increase"
            tooltip="The maximum percentage increase any one tenant may receive."
            iconColor="#52c41a"
          />
        }
        name="maxPercentIncrease"
        className="full-width-number"
      >
        <InputNumber min={0} max={100} addonBefore="%" style={{ width: 300 }} />
      </Form.Item>

      <Form.Item
        label={
          <FormLabel
            icon={<PercentageOutlined />}
            label="Min Percent Increase"
            tooltip="The minimum percentage increase any one tenant may receive."
            iconColor="#52c41a"
          />
        }
        name="minPercentIncrease"
        className="full-width-number"
      >
        <InputNumber min={0} max={100} addonBefore="%" style={{ width: 300 }} />
      </Form.Item>

      <Form.Item
        label={
          <FormLabel
            icon={<PercentageOutlined />}
            label="Store Occupancy Threshold"
            tooltip="The minimum occupancy required for any given facility to qualify for tenant rate increases."
            iconColor="#52c41a"
          />
        }
        name="storeOccupancyThreshold"
        className="full-width-number"
      >
        <InputNumber min={0} max={100} addonBefore="%" style={{ width: 300 }} />
      </Form.Item>

      <Form.Item
        label={
          <FormLabel
            icon={<ClockCircleOutlined />}
            label="Time Since Last Increase (months)"
            tooltip="The minimum time in months since a tenant's last rate increase."
            iconColor="#fa8c16"
          />
        }
        name="timeSinceLastIncrease"
        className="full-width-number"
      >
        <InputNumber min={0} style={{ width: 300 }} />
      </Form.Item>

      <Form.Item
        label={
          <FormLabel
            icon={<ClockCircleOutlined />}
            label="Time Since Move-in (months)"
            tooltip="The minimum time in months since a tenant's move-in date."
            iconColor="#fa8c16"
          />
        }
        name="timeSinceMoveIn"
        className="full-width-number"
      >
        <InputNumber min={0} style={{ width: 300 }} />
      </Form.Item>

      <Form.Item
        label={
          <FormLabel
            icon={<SettingOutlined />}
            label="Limit Above Street Rate ($)"
            tooltip="The absolute dollar value over the unit street rate a tenant is occupying."
          />
        }
        name="limitAboveStreetRate"
        className="full-width-number"
      >
        <InputNumber min={0} addonBefore="$" style={{ width: 300 }} />
      </Form.Item>

      <Form.Item
        label={
          <FormLabel
            icon={<SettingOutlined />}
            label="Limit Above Street Rate (%)"
            tooltip="The percentage over the unit street rate a tenant is occupying."
          />
        }
        name="percentAboveStreetRate"
        className="full-width-number"
      >
        <InputNumber min={0} max={100} addonBefore="%" style={{ width: 300 }} />
      </Form.Item>

      <Form.Item
        label={
          <FormLabel
            icon={<PercentageOutlined />}
            label="Max Move-Out Probability"
            tooltip="The desired upper threshold for any given tenant's move-out probability."
            iconColor="#52c41a"
          />
        }
        name="maxMoveOutProbability"
        className="full-width-number"
        style={{ marginBottom: 0 }}
      >
        <InputNumber min={0} max={100} addonBefore="%" style={{ width: 300 }} />
      </Form.Item>
    </SettingGroup>
  );
};

export default RateIncreaseCriteria;
