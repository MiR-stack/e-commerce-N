import NavItem from "./NavItem";
import Link from "next/link";
import { useHeaderContex } from "@/providers/HeaderContex";
import Logo from "./Logo";

const Navbar = () => {
  const { headerStyle, headerSize, isNavbarAppointmentBtn, isTextWhite } =
    useHeaderContex();
  const navItemsRaw = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Shop",
      path: "/shop",
    },
    {
      name: "About",
      path: "#",
    },
    {
      name: "Contact",
      path: "#",
      dropdown: null,
    },
  ];
  const navItems = navItemsRaw?.map((navItem, idx) => ({
    ...navItem,
  }));
  return (
    <div
      className={`col header-menu-column ${
        headerStyle === 2 || isTextWhite
          ? " menu-color-white"
          : headerStyle === 5
          ? "justify-content-center align-items-center"
          : ""
      }`}
    >
      {headerStyle === 5 ? <Logo sticky={true} /> : ""}
      <div
        className={`header-menu ${
          headerStyle === 5 ? "header-menu-2" : "d-none d-xl-block "
        } `}
      >
        <nav>
          <div className="ltn__main-menu">
            <ul>
              {navItems?.map((item, idx) => (
                <NavItem key={idx} item={item} />
              ))}
              {isNavbarAppointmentBtn ||
              headerSize === "lg" ||
              headerStyle === 2 ||
              headerStyle === 4 ? (
                <li className="special-link text-uppercase">
                  <Link href="#">GET A Quote</Link>
                </li>
              ) : (
                ""
              )}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
