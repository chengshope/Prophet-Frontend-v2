import { selectPortfolioName, selectUsername } from '@/features/auth/authSelector';
import { BulbOutlined, ColumnHeightOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Space } from 'antd';
import { useSelector } from 'react-redux';

const { Header } = Layout;

const MainHeader = ({ userMenuItems = [], onToggleTheme, onToggleDensity }) => {
  const portfolioName = useSelector(selectPortfolioName);
  const username = useSelector(selectUsername);

  return (
    <Header className="top-header">
      <span />
      <Space className="header-right" size={8}>
        {onToggleDensity && (
          <Button type="text" icon={<ColumnHeightOutlined />} onClick={onToggleDensity} />
        )}
        {onToggleTheme && <Button type="text" icon={<BulbOutlined />} onClick={onToggleTheme} />}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
          <Space className="user-profile" size={8}>
            <div className="user-meta">
              <div className="user-portfolio">{portfolioName}</div>
              <div className="user-name">{username || 'User'}</div>
            </div>
            <Avatar icon={<UserOutlined />} size={38} />
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default MainHeader;
