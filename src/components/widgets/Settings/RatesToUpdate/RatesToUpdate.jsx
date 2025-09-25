import { Form, Switch } from 'antd';
import SettingGroup from '@/components/common/SettingGroup';

const RatesToUpdate = ({ scope, loading = false }) => {
  return (
    <SettingGroup
      title="Rates To Update"
      description="Configure which rates should be updated automatically."
      loading={loading}
    >
      {/* Facility-specific fields */}
      {scope === 'facility' && (
        <>
          <Form.Item
            name="overridePortfolio"
            valuePropName="checked"
            label="Override Portfolio Rate Setting"
          >
            <Switch />
          </Form.Item>
        </>
      )}

      {/* Portfolio-specific fields */}
      {scope === 'portfolio' && (
        <Form.Item
          name="rate_hold_on_occupancy"
          valuePropName="checked"
          label="Do not decrease rates on fully occupied types"
        >
          <Switch />
        </Form.Item>
      )}

      <Form.Item name="web_rate" valuePropName="checked" label="Web Rate">
        <Switch />
      </Form.Item>

      <Form.Item
        name="street_rate"
        label="Street Rate"
        style={{ marginBottom: 0 }}
      >
        <Switch />
      </Form.Item>
    </SettingGroup>
  );
};

export default RatesToUpdate;
