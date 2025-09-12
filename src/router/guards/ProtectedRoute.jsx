import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth?.token);
  const isAuthenticated = Boolean(token);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
