import { Form, InputNumber } from 'antd';
import { PercentageOutlined } from '@ant-design/icons';
import SettingGroup from '@/components/common/SettingGroup';
import FormLabel from '@/components/common/FormLabel';

const RevenueGoal = () => {
  return (
    <SettingGroup
      title="Revenue Goal"
      description="Set the target average percent increase for revenue optimization."
    >
      <Form.Item
        label={
          <FormLabel
            icon={<PercentageOutlined />}
            label="Average Percent Increase"
            tooltip="Average rate increase percentage for eligible tenants. Recommended range: 5-25%"
            iconColor="#52c41a"
          />
        }
        name="averagePercentIncrease"
        className="full-width-number"
        style={{ marginBottom: 0 }}
      >
        <InputNumber min={0} max={100} addonBefore="%" style={{ width: 300 }} />
      </Form.Item>
    </SettingGroup>
  );
};

export default RevenueGoal;
