import { ThemeContextProvider, useThemeContext } from '@/contexts/ThemeContext';
import { getTheme } from '@/styles/antd-theme';
import { ConfigProvider, theme } from 'antd';

const AntdConfigProvider = ({ children }) => {
  const { isDarkMode, isCompact } = useThemeContext();
  const currentTheme = getTheme(isDarkMode);

  const algorithm = isDarkMode
    ? isCompact
      ? [theme.darkAlgorithm, theme.compactAlgorithm]
      : theme.darkAlgorithm
    : isCompact
      ? [theme.defaultAlgorithm, theme.compactAlgorithm]
      : theme.defaultAlgorithm;

  return (
    <ConfigProvider
      theme={{
        ...currentTheme,
        algorithm,
      }}
      componentSize={isCompact ? 'small' : 'middle'}
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
