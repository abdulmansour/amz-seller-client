import { Button } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { FC, useCallback } from 'react';

const SignOut: FC = () => {
  const auth = getAuth();
  const handleSignOut = useCallback(() => {
    signOut(auth).then(() => {
      // Sign-out successful.
    });
  }, [auth]);

  return <Button onClick={handleSignOut}>Sign Out</Button>;
};

export default SignOut;
