import AuthForm from '@components/AuthForm';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';

const LoginPage = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/');
  }, [user]);

  return <>{!user && <AuthForm />}</>;
};

export default LoginPage;
