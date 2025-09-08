import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { routeConfig } from './routes';

const AppRoutes = () => {
  const element = useRoutes(routeConfig);
  return element;
};

const AppRouter = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default AppRouter;
