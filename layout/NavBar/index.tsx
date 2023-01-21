import { NavbarContainer, NavbarItem } from "./styled";

export interface INavbarItem {
  label: string;
  onClick: () => void;
}

const Navbar = () => {
  const navbarItems: INavbarItem[] = [
    { label: "MapView", onClick: () => null },
    { label: "Orders", onClick: () => null },
  ];
  return (
    <NavbarContainer>
      {navbarItems.map((item, i) => {
        return (
          <NavbarItem key={i} onClick={() => item.onClick()}>
            {item.label}
          </NavbarItem>
        );
      })}
    </NavbarContainer>
  );
};

export default Navbar;
