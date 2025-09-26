import {
  useRunECRIPythonMutation,
  useRunStreetRatesPythonMutation,
  useSyncDataMutation,
} from '@/api/syncDataApi';
import { selectUser } from '@/features/auth/authSelector';
import { showError } from '@/utils/messageService';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Loading.less';

const handleSyncError = (error, redirectPath) => {
  console.error('Sync error:', error);
  const message = error?.data?.errors || error.message || String(error);
  showError(`Error refreshing data: ${message}`);
  return redirectPath || '/street-rates';
};

const Loading = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const user = useSelector(selectUser);
  const isAuthenticated = Boolean(user);
  const hasExecuted = useRef(false);

  const [syncData] = useSyncDataMutation();
  const [runStreetRatesPython] = useRunStreetRatesPythonMutation();
  const [runECRIPython] = useRunECRIPythonMutation();

  const [loadingText, setLoadingText] = useState('Calculating Your Rate Recommendations...');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (hasExecuted.current) return;
    hasExecuted.current = true;

    const executeSync = async () => {
      try {
        if (!redirectParam || redirectParam === 'sign-in') {
          setLoadingText('Syncing data...');
          await syncData().unwrap();
          navigate('/street-rates');
        } else if (redirectParam === 'street-rates') {
          setLoadingText('Calculating Your Street Rate Recommendations...');
          await runStreetRatesPython().unwrap();
          navigate('/street-rates');
        } else if (redirectParam === 'existing-customer-rate-increases') {
          setLoadingText('Syncing data...');
          await syncData().unwrap();
          setLoadingText('Calculating Your Rate Recommendations...');
          await runECRIPython().unwrap();
          navigate(`/${redirectParam}`);
        }
      } catch (error) {
        const path = handleSyncError(error, redirectParam || '/street-rates');
        navigate(path);
      }
    };

    executeSync();
  }, [redirectParam, isAuthenticated, syncData, runStreetRatesPython, runECRIPython, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="loading-content">
        <div className="loading-animation">
          <img src="/assets/images/loading.svg" alt="Loading Animation" className="loading-svg" />
        </div>
        <p className="loading-text">{loadingText}</p>
      </div>
    </div>
  );
};

export default Loading;
