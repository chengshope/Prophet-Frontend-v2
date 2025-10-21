import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { memo } from 'react';

const competitorTypes = ['Direct', 'Indirect', 'Non-competitor'];

const colors = {
  Direct: 'red',
  Indirect: 'purple',
  'Non-competitor': 'blue',
};

const CompetitorTypeSelect = memo(({ selected, onChange, disabled = false, size = 'small' }) => {
  const handleMenuClick = ({ key }) => {
    if (onChange) {
      onChange(key);
    }
  };

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
        <Button variant="filled" color={colors[selected]} icon={<MoreOutlined />} />,
      ]}
    />
  );
});

CompetitorTypeSelect.displayName = 'CompetitorTypeSelect';

export default CompetitorTypeSelect;
