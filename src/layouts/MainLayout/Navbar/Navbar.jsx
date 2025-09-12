import fullLogo from '@/assets/prophet_logo.svg';
import logoIcon from '@/assets/prophet_logo_icon.svg';
import { Image, Layout, Menu } from 'antd';

const { Sider } = Layout;

const Navbar = ({ collapsed, selectedKey, items }) => {
  return (
    <Sider trigger={null} collapsible collapsed={collapsed} className="sidebar">
      <div className={`logo-area ${collapsed ? 'collapsed' : ''}`}>
        {!collapsed ? (
          <Image src={fullLogo} alt="Prophet" preview={false} className="logo-img logo-img-full" />
        ) : (
          <Image src={logoIcon} alt="Prophet" preview={false} className="logo-img logo-img-icon" />
        )}
      </div>

      <Menu mode="inline" selectedKeys={[selectedKey]} className="navigation-menu" items={items} />
    </Sider>
  );
};

export default Navbar;
