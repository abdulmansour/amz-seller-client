import { ErrorMessage } from '@layout/Global/styled';
import { Button, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import { AuthFormBody, AuthFormContainer } from './styled';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AuthFormProps {}

const AuthForm = ({}: AuthFormProps) => {
  const { handleSignIn, errorMessage } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Enter') handleSignIn && handleSignIn(email, password);
  };

  return (
    <AuthFormContainer>
      <AuthFormBody>
        <TextField
          label="Email"
          variant="outlined"
          margin="dense"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          margin="dense"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={() => handleSignIn && handleSignIn(email, password)}>
          Sign In
        </Button>
      </AuthFormBody>
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </AuthFormContainer>
  );
};

export default AuthForm;
