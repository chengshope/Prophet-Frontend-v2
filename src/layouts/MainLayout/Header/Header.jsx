import { selectPortfolioName, selectUsername } from '@/features/auth/authSelector';
import { BulbOutlined, UserOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Space, Breadcrumb, Segmented } from 'antd';
import { useSelector } from 'react-redux';
import { useThemeContext } from '@/contexts/ThemeContext';

const { Header } = Layout;

const MainHeader = ({ breadcrumbItems = [], userMenuItems = [] }) => {
  const portfolioName = useSelector(selectPortfolioName);
  const username = useSelector(selectUsername);
  const { isDarkMode, toggleTheme } = useThemeContext();

  const handleThemeChange = (value) => {
    if ((value === 'dark' && !isDarkMode) || (value === 'light' && isDarkMode)) {
      toggleTheme();
    }
  };

  return (
    <Header className="top-header">
      <div className="header-left">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <Space className="header-right" size={8}>
        <Segmented
          size="small"
          value={isDarkMode ? 'dark' : 'light'}
          onChange={handleThemeChange}
          options={[
            {
              label: <SunOutlined />,
              value: 'light',
            },
            {
              label: <MoonOutlined />,
              value: 'dark',
            },
          ]}
        />
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
