import styles from "./Navigation.module.scss";
import { NavLink, useLocation } from "react-router-dom";

export default function NavItem({ item }) {
  const href = item.link.toLowerCase();
  const location = useLocation();

  const customActive = () => {
    if (href === "home") return location.pathname === "/";
    if (href === "shop") return location.pathname === "/shop";

    return location.pathname.startsWith(`/${href}`);
  };

  return (
    <NavLink
      to={href === "home" ? "/" : href}
      className={
        customActive()
          ? `${styles.navLink} ${styles.active}`
          : styles.navLink
      }
    >
      {item.name}
      <span className={styles.line}></span>
    </NavLink>
  );
}
