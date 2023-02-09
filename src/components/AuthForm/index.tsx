import { useContext, useState } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AuthFormProps {}

const AuthForm = ({}: AuthFormProps) => {
  const { handleSignIn, errorMessage } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => handleSignIn && handleSignIn(email, password)}>
        Sign In
      </button>
      <div>{errorMessage}</div>
    </div>
  );
};

export default AuthForm;
