import SignOut from '@components/AuthForm/SignOut';
import { memo } from 'react';
import { NavbarContainer, NavbarItem } from './styled';

const Navbar = () => {
  return (
    <NavbarContainer>
      <NavbarItem>
        <SignOut />
      </NavbarItem>
    </NavbarContainer>
  );
};

export default memo(Navbar);
