import FormLabel from '@/components/common/FormLabel';
import SettingGroup from '@/components/common/SettingGroup';
import { isOverRecommended } from '@/utils/settingsHelpers';
import { PercentageOutlined } from '@ant-design/icons';
import { Form, InputNumber } from 'antd';
import { useEffect, useState } from 'react';

const RevenueGoal = ({ loading = false }) => {
  const form = Form.useFormInstance();
  const [averagePercentIncrease, setAveragePercentIncrease] = useState(null);

  // Sync state with form values when form is populated
  useEffect(() => {
    if (form) {
      const values = form.getFieldsValue(['averagePercentIncrease']);
      if (values.averagePercentIncrease !== averagePercentIncrease) {
        setAveragePercentIncrease(values.averagePercentIncrease);
      }
    }
  }); // Run on every render to catch form value changes

  return (
    <SettingGroup
      title="Revenue Goal"
      description="Set the target average percent increase for revenue optimization."
      loading={loading}
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
        <InputNumber
          min={0}
          addonBefore="%"
          style={{ width: 300 }}
          onChange={(value) => setAveragePercentIncrease(value)}
          status={isOverRecommended(averagePercentIncrease) ? 'error' : ''}
        />
      </Form.Item>
    </SettingGroup>
  );
};

export default RevenueGoal;
