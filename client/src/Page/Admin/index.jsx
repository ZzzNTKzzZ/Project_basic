import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useUser } from "../../Hook/useUserContext";
import styles from "./Admin.module.scss";
import {
  DashBoard,
  Delivery,
  Product,
  Report,
  Setting,
  User,
} from "../../Assets";
import { useEffect, useState } from "react";

export default function Admin() {
  const { user, loadingUser } = useUser();

  const listDashBoard = [
    { name: "Dash Board", icon: <DashBoard />, path: "dashboard" },
    { name: "User", icon: <User />, path: "user" },
    { name: "Product", icon: <Product />, path: "product" },
    { name: "Orders", icon: <Delivery />, path: "order" },
    { name: "Settings", icon: <Setting />, path: "setting" },
  ];

  const [generalData, setGeneralData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchGeneral = async () => {
      const resUser = await fetch("http://localhost:5000/user");
      const resOrder = await fetch("http://localhost:5000/order");
      const resBestSeller = await fetch(
        "http://localhost:5000/products/bestSeller"
      );
      const resLatestOrder = await fetch("http://localhost:5000/order/latest");

      const dataUser = await resUser.json();
      const dataOrder = await resOrder.json();
      const dataBestSeller = await resBestSeller.json();
      const dataLatestOrder = await resLatestOrder.json();

      setGeneralData({
        totalUser: dataUser.length,
        totalSale: dataOrder
          .reduce((total, data) => {
            return total + data.price;
          }, 0)
          .toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
        totalOrder: dataOrder.length,
        totalPending: dataOrder.filter((data) => data.status === "Pending")
          .length,
        bestSeller: dataBestSeller,
        latestOrder: dataLatestOrder,
      });

      setLoading(false);
    };
    fetchGeneral();
  }, []);

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`${styles.wrapper}`}>
      <nav>
        <div className={styles.header}>
          <img src={`http://localhost:5000${user.image}`} alt="" />
          <span className={styles.userName}>{user.name}</span>
        </div>
      </nav>
      <div className={styles.body}>
        <div className={`${styles.dashboard} col-2`}>
          <h2>Dash board</h2>
          {listDashBoard.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : "")}
              key={item.name}
              to={item.path}
            >
              <span className={styles.icon}>{item.icon}</span>
              <p className={styles.name}>{item.name}</p>
            </NavLink>
          ))}
        </div>
        <div className={`${styles.content} col-10`}>
          <Outlet context={{ generalData, setGeneralData, loading }} />
        </div>
      </div>
    </div>
  );
}
