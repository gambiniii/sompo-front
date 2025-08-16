import { useAppSelector } from '@/shared/hooks/use-app-selector';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
  const user = useAppSelector((store) => store.auth.user);

  if (!user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
