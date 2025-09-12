import {
  BellOutlined,
  BulbOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Breadcrumb, Button, Dropdown, Input, Layout, Space } from 'antd';

const { Header } = Layout;

const MainHeader = ({
  collapsed,
  onToggleCollapsed,
  breadcrumbItems = [],
  user,
  userMenuItems = [],
  onToggleTheme,
}) => {
  return (
    <Header className="top-header">
      <Space className="header-left" size={12}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapsed}
          className="menu-toggle-btn"
        />
        <Breadcrumb items={breadcrumbItems} className="breadcrumb-nav" />
      </Space>

      <Space className="header-right" size={12}>
        <Input.Search placeholder="Search" allowClear className="top-search" />
        <Button type="text" icon={<BulbOutlined />} onClick={onToggleTheme} />
        <Badge dot>
          <Button type="text" icon={<BellOutlined />} />
        </Badge>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
          <Space className="user-profile">
            <Avatar icon={<UserOutlined />} />
            <span>{user?.name || 'User'}</span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default MainHeader;

