import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Space } from 'antd';

const { Header } = Layout;

const MainHeader = ({ collapsed, onToggleCollapsed, user, userMenuItems = [], onToggleTheme }) => {
  return (
    <Header className="top-header">
      <Space className="header-left" size={12}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapsed}
          className="menu-toggle-btn"
        />
      </Space>

      <Space className="header-right" size={12}>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
          <Space className="user-profile">
            <span>{user?.name || 'User'}</span>
            <Avatar icon={<UserOutlined />} />
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default MainHeader;
