import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from './Loading';

const ProtectedRoute = ({ children, role }) => {
  const { user, status } = useSelector((state) => state.auth);
  const location = useLocation();
  if (status === 'checking') return <Loading />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (role && user.role !== role) return <Navigate to="/write" replace />;
  return children;
};

export default ProtectedRoute;
