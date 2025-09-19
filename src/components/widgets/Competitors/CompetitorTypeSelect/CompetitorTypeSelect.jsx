/**
 * CompetitorTypeSelect Component
 * Following Rule #4: components/widgets/Competitors/CompetitorTypeSelect
 * Matching v1 CompetitorTypeSelect functionality exactly
 */

import { Button, Dropdown } from 'antd';
import { memo } from 'react';
import { MoreOutlined } from '@ant-design/icons';

// Competitor types matching v1
const competitorTypes = ['Direct', 'Indirect', 'Non-competitor'];

// Colors matching v1
const colors = {
  Direct: 'green',
  Indirect: 'pink',
  'Non-competitor': 'yellow',
};

const CompetitorTypeSelect = memo(({ selected, onChange, disabled = false, size = 'small' }) => {
  // Handle menu click
  const handleMenuClick = ({ key }) => {
    if (onChange) {
      onChange(key);
    }
  };

  // Create menu items for Dropdown
  const menuItems = competitorTypes.map((type) => ({
    key: type,
    label: type,
  }));

  return (
    <Dropdown.Button
      size={size}
      menu={{
        items: menuItems,
        onClick: handleMenuClick,
      }}
      disabled={disabled}
      type={selected ? undefined : 'default'}
      buttonsRender={([]) => [
        <Button block variant="filled" color={colors[selected]}>
          {selected ?? 'Select...'}
        </Button>,
        <Button variant="filled" color={colors[selected]} icon={<MoreOutlined />}/>,
      ]}
    />
  );
});

CompetitorTypeSelect.displayName = 'CompetitorTypeSelect';

export default CompetitorTypeSelect;
