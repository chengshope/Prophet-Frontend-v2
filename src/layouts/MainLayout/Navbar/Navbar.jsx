import fullLogo from '@/assets/prophet_logo.svg';
import logoIcon from '@/assets/prophet_logo_icon.svg';
import { MenuFoldOutlined, MenuUnfoldOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { Button, Image, Layout, Menu, Tooltip, Switch, Space } from 'antd';
import { useThemeContext } from '@/contexts/ThemeContext';

const { Sider } = Layout;

const Navbar = ({ collapsed, onToggleCollapsed, selectedKey, items }) => {
  const { isDarkMode, toggleTheme } = useThemeContext();

  const handleThemeChange = (checked) => {
    if ((checked && !isDarkMode) || (!checked && isDarkMode)) {
      toggleTheme();
    }
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} className="sidebar" width={250}>
      <div className={`logo-area ${collapsed ? 'collapsed' : ''}`}>
        {!collapsed ? (
          <Image src={fullLogo} alt="Prophet" preview={false} className="logo-img logo-img-full" />
        ) : (
          <Image src={logoIcon} alt="Prophet" preview={false} className="logo-img logo-img-icon" />
        )}
      </div>

      <Menu mode="inline" selectedKeys={[selectedKey]} className="navigation-menu" items={items} />

      <div className="sider-filler" />

      <div className="sider-bottom">
        <div className="theme-toggle-container">
          {collapsed ? (
            <Tooltip
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              placement="right"
            >
              <Switch
                checked={isDarkMode}
                onChange={handleThemeChange}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                style={{ marginBottom: '8px' }}
              />
            </Tooltip>
          ) : (
            <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: '8px' }}>
              <Switch
                checked={isDarkMode}
                onChange={handleThemeChange}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                style={{ alignSelf: 'center' }}
              />
            </Space>
          )}
        </div>
        {collapsed ? (
          <Tooltip title="Expand sidebar" placement="right">
            <Button
              block
              type="text"
              onClick={onToggleCollapsed}
              icon={<MenuUnfoldOutlined />}
              className="sider-collapse-btn"
            />
          </Tooltip>
        ) : (
          <Button
            block
            type="text"
            onClick={onToggleCollapsed}
            icon={<MenuFoldOutlined />}
            className="sider-collapse-btn"
            color="default"
            variant="filled"
          >
            Collapse
          </Button>
        )}
      </div>
    </Sider>
  );
};

export default Navbar;
