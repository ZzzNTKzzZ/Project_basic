import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Bell, Order, User } from "../../Assets";
import { useUser } from "../../Hook/useUserContext";
import styles from "./Account.module.scss";
import PopUpAddress from "./PopUpAddress";

export default function Account() {
  const { user, setUser } = useUser();
  const [popUpAddress, setPopUpAddress] = useState(false);
  const [address, setAddress] = useState(user.address || []);

  useEffect(() => {
    setAddress(user.address);
  }, [user]);
  return (
    <div className={`${styles.wrapper} container`}>
      {/* Sidebar */}
      <div className={`col-3 ${styles.dashBoard}`}>
        <div className={styles.header}>
          <img src={`http://localhost:5000${user.image}`} alt="" />
          <span className={styles.userName}>{user.name}</span>
        </div>

        {/* Account */}
        <div className={styles.option}>
          <div className={styles.title}>
            <span>
              <User />
            </span>
            <Link to="profile">
              <p>My account</p>
            </Link>
          </div>
          <div className={styles.subOptions}>
            <NavLink
              to="profile"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Profile
            </NavLink>
            <NavLink
              to="address"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Address
            </NavLink>
            <NavLink
              to="password"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Password
            </NavLink>
          </div>
        </div>

        {/* Orders */}
        <div className={styles.option}>
          <div className={styles.title}>
            <span>
              <Order />
            </span>
            <Link to="order">Order</Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`col-9 ${styles.board}`}>
        <Outlet context={{ setPopUpAddress, address }} />
      </div>

      {/* Pop-up Address */}
      {popUpAddress && (
        <PopUpAddress
          closePopup={() => setPopUpAddress(false)}
          user={user}
          setUser={setUser}
          setAddress={setAddress}
        />
      )}
    </div>
  );
}
