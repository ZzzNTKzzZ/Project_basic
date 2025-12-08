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

  // ===========================
  // SIDEBAR CONFIG LIST
  // ===========================
  const sidebarMenu = [
    {
      title: "My account",
      icon: <User />,
      root: "profile",
      sub: [
        { name: "Profile", path: "profile" },
        { name: "Address", path: "address" },
        { name: "Password", path: "password" },
      ],
    },
    {
      title: "Order",
      icon: <Order />,
      root: "order",
      sub: [], // no children
    },
  ];

  return (
    <div className={`${styles.wrapper} container`}>
      
      {/* Sidebar */}
      <div className={`col-3 ${styles.dashBoard}`}>
        <div className={styles.header}>
          <img src={`http://localhost:5000${user.image}`} alt="" />
          <span className={styles.userName}>{user.name}</span>
        </div>

        {/* AUTO-RENDER SIDEBAR */}
        {sidebarMenu.map((section, i) => (
          <div className={styles.option} key={i}>
            <div className={styles.title}>
              <span>{section.icon}</span>
              <Link to={section.root}>{section.title}</Link>
            </div>

            {section.sub.length > 0 && (
              <div className={styles.subOptions}>
                {section.sub.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    className={({ isActive }) =>
                      isActive ? styles.active : ""
                    }
                  >
                    {sub.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
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
