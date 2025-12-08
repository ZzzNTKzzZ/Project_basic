import { Link } from "react-router-dom";
import { Bag, Heart, Search, User } from "../../Assets";
import Button from "../Button";
import styles from "./Navigation.module.scss";
import NavItem from "./NavItem";
import { useRef, useState } from "react";
import Cart from "../Cart";
import { useCart } from "../../Hook/useCartContext";
import InputBar from "../InputBar";
import { useUser } from "../../Hook/useUserContext";
import useClickOutside from "../../Hook/useClickOutSide";

export default function Navigation() {
  const navItems = [
    { name: "Home", link: "home" },
    { name: "Shop", link: "shop" },
    { name: "New Arrival", link: "shop/new_arrival" },
    { name: "Sale", link: "shop/sale" },
  ];

  const { user, setUser } = useUser();
  const { totalItems } = useCart();

  const optionRef = useRef(null);
  const [openCart, setOpenCart] = useState(false);
  const [popUpOptions, setPopUpOptions] = useState(false);

  const toggleUserOptions = () => {
    if (Object.keys(user).length > 0) {
      setPopUpOptions((prev) => !prev);
    }
  };

  const toggleCart = () => {
    setOpenCart((prev) => !prev);
  };

  const handleLogOut = () => {
    localStorage.removeItem("user");
    setUser({});
  };

  // USER MENU OPTIONS LIST
  const userOptions = [
    { label: "My account", link: "/account/profile" },
    { label: "Order", link: "/account/order" },
    { label: "Report", link: "/admin", adminOnly: true },
    { label: "Log out", action: handleLogOut },
  ];

  useClickOutside(optionRef, () => setPopUpOptions(false), popUpOptions);

  return (
    <nav className={styles.wrapper}>
      <div className={`${styles.right} col-4`}>
        {navItems.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </div>

      <div className={`${styles.logo} col-4`}>
        <Link to="/">Elora Store</Link>
      </div>

      <div className={`${styles.left} col-4`}>
        <InputBar icon={<Search width="auto" height="42" />} />

        {/* CART BUTTON */}
        <span className={styles.cart} onClick={toggleCart}>
          {totalItems !== 0 && (
            <span className={styles.noti}>
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
          <Button
            className={styles.cartBtn}
            icon={<Bag width="auto" height="42" />}
            type={2}
            href="/cart"
          />
        </span>

        {/* LIKE BUTTON */}
        <Button
          className={styles.likeBtn}
          icon={<Heart width="auto" height="42" />}
          type={2}
          href={"/like"}
        />

        {/* USER BUTTON */}
        <Button
          className={styles.loginBtn}
          icon={<User width="auto" height="42" />}
          href={Object.keys(user).length === 0 ? "/login" : ""}
          onClick={toggleUserOptions}
        />

        {/* CART POPUP */}
        {openCart && (
          <Cart
            openCart={openCart}
            setOpenCart={setOpenCart}
            className={styles.cartPopup}
          />
        )}

        {/* USER OPTIONS POPUP */}
        {popUpOptions && (
          <div
            className={styles.optionUser}
            ref={optionRef}
            onClick={() => setPopUpOptions(false)}
          >
            {userOptions.map((opt, i) => {
              // Admin only item
              if (opt.adminOnly && user.role !== "admin") return null;

              // Link item
              if (opt.link) {
                return (
                  <Link key={i} to={opt.link} className={styles.option}>
                    {opt.label}
                  </Link>
                );
              }

              // Action item (logout)
              return (
                <span key={i} className={styles.option} onClick={opt.action}>
                  {opt.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
