import { setMessageApi } from '@/utils/messageService';
import { App } from 'antd';
import { useEffect } from 'react';

export default function AppProvider({ children }) {
  const { message } = App.useApp();

  useEffect(() => {
    setMessageApi(message);
  }, [message]);

  return children;
}
