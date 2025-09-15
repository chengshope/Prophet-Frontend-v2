import fullLogo from '@/assets/prophet_logo.svg';
import logoIcon from '@/assets/prophet_logo_icon.svg';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Image, Layout, Menu, Tooltip } from 'antd';

const { Sider } = Layout;

const Navbar = ({ collapsed, onToggleCollapsed, selectedKey, items }) => {
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
