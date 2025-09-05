import { ConfigProvider, theme } from 'antd';
import {
  ThemeContextProvider,
  useThemeContext,
} from '../contexts/ThemeContext';
import { getTheme } from '../styles/antd-theme';

const AntdConfigProvider = ({ children }) => {
  const { isDarkMode } = useThemeContext();
  const currentTheme = getTheme(isDarkMode);

  return (
    <ConfigProvider
      theme={{
        ...currentTheme,
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

const ThemeProvider = ({ children }) => {
  return (
    <ThemeContextProvider>
      <AntdConfigProvider>{children}</AntdConfigProvider>
    </ThemeContextProvider>
  );
};

export default ThemeProvider;
