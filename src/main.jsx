import '@ant-design/v5-patch-for-react-19';
import { App } from 'antd';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import ThemeProvider from './components/ThemeProvider';
import './index.css';
import AppProvider from './providers/AppProvider.jsx';
import AppRouter from './router/AppRouter';
import { store } from './store/store.js';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App>
          <AppProvider>
            <AppRouter />
          </AppProvider>
        </App>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
