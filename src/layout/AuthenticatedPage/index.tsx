import { LoadingSpinner } from '@components/LoadingSpinner';
import Navbar from '@layout/NavBar';
import { memo, PropsWithChildren, useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import { PageContainer } from './styled';

const AuthenticatedPage = ({ children }: PropsWithChildren) => {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user && (
        <PageContainer>
          <Navbar />
          {children}
        </PageContainer>
      )}
      {!user && <LoadingSpinner loading={1} />}
    </>
  );
};

export default memo(AuthenticatedPage);
