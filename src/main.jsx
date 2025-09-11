import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import ThemeProvider from './components/ThemeProvider';
import './index.css';
import AppRouter from './router/AppRouter';
import { store } from './store/store.js';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
