import ThemeProvider from '@/providers/ThemeProvider';
import '@ant-design/v5-patch-for-react-19';
import { App, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import AppProvider from './providers/AppProvider.jsx';
import AppRouter from './router/AppRouter';
import { store } from './store/store.js';
import './styles/global.less';
import './styles/pagination.less';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={enUS}>
        <ThemeProvider>
          <App>
            <AppProvider>
              <AppRouter />
            </AppProvider>
          </App>
        </ThemeProvider>
      </ConfigProvider>
    </Provider>
  </StrictMode>
);
