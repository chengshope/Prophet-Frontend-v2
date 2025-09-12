import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = useSelector((state) => state.auth?.token);
  const isAuthenticated = Boolean(token);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;

