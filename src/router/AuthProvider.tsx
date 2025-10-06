import { useNavigate } from 'react-router-dom';
import useAuth, { AuthStatus } from '../store/useAuth';
import { useEffect } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: PrivateRouteProps) => {
  const { authStatus } = useAuth();
  const route = useNavigate();

  useEffect(() => {
    if (authStatus === AuthStatus.unauthorized) {
      route('/chat/login');
    }
  }, [authStatus, route]);

  if (authStatus === AuthStatus.pending) return null;

  return authStatus === AuthStatus.authorized ? <>{children}</> : null;
};

export default AuthProvider;
