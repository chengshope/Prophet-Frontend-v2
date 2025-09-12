import { Layout, Menu, Typography } from 'antd';

const { Sider } = Layout;
const { Title } = Typography;

const Navbar = ({ collapsed, selectedKey, items }) => {
  return (
    <Sider trigger={null} collapsible collapsed={collapsed} className="sidebar">
      <div className={`logo-area ${collapsed ? 'collapsed' : ''}`}>
        <Title level={4} className={`logo-title ${collapsed ? 'hidden' : ''}`}>
          Prophet
        </Title>
        {collapsed && (
          <Title level={4} className="logo-title">
            P
          </Title>
        )}
      </div>

      <Menu mode="inline" selectedKeys={[selectedKey]} className="navigation-menu" items={items} />
    </Sider>
  );
};

export default Navbar;
