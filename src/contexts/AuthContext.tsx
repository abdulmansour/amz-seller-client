import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { useRouter } from 'next/router';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { initFirebase } from 'src/contexts/firebaseApp';

export interface AuthContextState {
  user: User | undefined;
  handleSignIn: ((email: string, password: string) => void) | undefined;
  errorMessage: string;
}

export const AuthContext = createContext<AuthContextState>({
  user: undefined,
  handleSignIn: undefined,
  errorMessage: '',
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User>();
  const app = useMemo(() => initFirebase(), []);
  const auth = useMemo(() => getAuth(app), [app]);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  onAuthStateChanged(auth, (_user) => {
    if (_user) {
      if (!user) setUser(_user);
      if (typeof window !== 'undefined') {
        if (router.asPath !== '/') router.push('/');
      }
    } else {
      if (user) setUser(undefined);
      if (typeof window !== 'undefined') {
        if (router.asPath !== '/login') router.push('/login');
      }
    }
  });

  const handleSignIn = useCallback(
    (email: string, password: string) => {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          setUser(userCredential.user);
          // ...
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    },
    [auth]
  );

  return (
    <AuthContext.Provider value={{ user, handleSignIn, errorMessage }}>
      {children}
    </AuthContext.Provider>
  );
};
