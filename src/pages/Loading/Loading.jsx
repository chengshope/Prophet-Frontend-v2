import {
  useRunECRIPythonMutation,
  useRunStreetRatesPythonMutation,
  useSyncDataMutation,
} from '@/api/syncDataApi';
import { selectUser } from '@/features/auth/authSelector';
import { showError } from '@/utils/messageService';
import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Loading.less';

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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSyncData = useCallback(async () => {
    try {
      await syncData().unwrap();
      navigate('/street-rates');
    } catch (error) {
      console.error('Sync data error:', error);
      const errorMessage = error?.data?.errors || error.message || error.toString();
      showError(`Error refreshing data: ${errorMessage}`);
      navigate('/street-rates'); // Navigate anyway to prevent being stuck
    }
  }, [syncData, navigate]);

  const handleSyncStreetRatesData = useCallback(async () => {
    try {
      await runStreetRatesPython().unwrap();
      navigate(`/${redirectParam}`);
    } catch (error) {
      console.error('Street rates sync error:', error);
      const errorMessage = error?.data?.errors || error.message || error.toString();
      showError(`Error refreshing data: ${errorMessage}`);
      navigate(`/${redirectParam}`); // Navigate anyway to prevent being stuck
    }
  }, [runStreetRatesPython, navigate, redirectParam]);

  const handleSyncECRIData = useCallback(async () => {
    try {
      // First call sync-data
      await syncData().unwrap();
      // Then call ecri/run-python
      await runECRIPython().unwrap();
      navigate(`/${redirectParam}`);
    } catch (error) {
      console.error('ECRI sync error:', error);
      const errorMessage = error?.data?.errors || error.message || error.toString();
      showError(`Error refreshing data: ${errorMessage}`);
      navigate(`/${redirectParam}`); // Navigate anyway to prevent being stuck
    }
  }, [syncData, runECRIPython, navigate, redirectParam]);

  // Execute appropriate sync function based on redirect parameter
  useEffect(() => {
    if (!isAuthenticated) return;
    if (hasExecuted.current) return; // Prevent double execution in React Strict Mode

    console.log('Loading useEffect triggered with redirectParam:', redirectParam);
    hasExecuted.current = true;

    if (!redirectParam) {
      // No redirect param - default sync data and go to street-rates
      handleSyncData();
      return;
    }

    switch (redirectParam) {
      case 'street-rates':
        handleSyncStreetRatesData();
        break;
      case 'existing-customer-rate-increases':
        handleSyncECRIData();
        break;
      case 'sign-in':
      default:
        handleSyncData();
        break;
    }
  }, [redirectParam, isAuthenticated, handleSyncData, handleSyncStreetRatesData, handleSyncECRIData]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-animation">
          <img
            src="/assets/images/loading.svg"
            alt="Loading Animation"
            className="loading-svg"
          />
        </div>
        <p className="loading-text">Calculating Your Rate Recommendations...</p>
      </div>
    </div>
  );
};

export default Loading;
