import AuthForm from '@components/AuthForm';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';

const LoginPage = () => {
  const { user } = useContext(AuthContext);

  return <>{!user && <AuthForm />}</>;
};

export default LoginPage;
