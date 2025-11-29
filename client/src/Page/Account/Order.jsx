import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import styles from "./Account.module.scss";
import { useEffect, useState } from "react";
import { useUser } from "../../Hook/useUserContext";
import Button from "../../Components/Button";
import { useCart } from "../../Hook/useCartContext";

function ListOrder({ listOrder = [], loadingOrder }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleRepurchase = (items) => {
    items.forEach((i) => {
      let product = { ...i, ...i.product };
      addToCart(product);
    });
    navigate("/cart");
  };

  if(loadingOrder) return;

  return (
    <div className={styles.orderList}>
      {listOrder.length === 0 ? (
        <p>No Order Found</p>
      ) : (
        listOrder.map((order) => (
          <div className={styles.orders} key={order._id}>
            <div className={styles.order}>
              {order.orderItems.map((item) => (
                <div key={item._id}>
                  <Link to={"/"} className={styles.review}>
                    Review
                  </Link>
                  <div className={styles.item}>
                    <img
                      src={`http://localhost:5000${item.product.image}`}
                      alt=""
                    />
                    <span className={styles.info}>
                      <p className={styles.name}>{item.product.name}</p>
                      <p className={styles.variants}>
                        {Object.values(item.variants).join(", ")}
                      </p>
                      <p className={styles.quantity}>x{item.quantity}</p>
                    </span>
                    <span className={styles.priceReview}>
                      <p className={styles.price}>
                        ${item.product.price * item.quantity}
                      </p>
                    </span>
                  </div>
                </div>
              ))}
              <span className={styles.amount}>
                <p>Total amount:</p>$
                {order.orderItems.reduce(
                  (total, item) => total + item.product.price * item.quantity,
                  0
                )}
              </span>
              <span className={styles.repurchase}>
                <Button onClick={() => handleRepurchase(order.orderItems)}>
                  Repurchase
                </Button>
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function Order() {
  const { tabPath } = useParams(); // get :tabPath
  const { user, loadingUser } = useUser();
  const [orders, setOrders] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`http://localhost:5000/order/${user._id}`);
      const data = await res.json();

      setOrders(data);
      setLoadingOrder(false);
    };
    if (!loadingUser) fetchOrder();
  }, [loadingUser, user]);
  // TODO: Sort order from new to old
  const tabs = [
    { label: "All", path: "all", orders: orders },
    {
      label: "Pending Confirmation",
      path: "pending",
      orders: orders.filter((o) => o.status.toLowerCase() === "pending"),
    },
    {
      label: "In Transit",
      path: "in-transit",
      orders: orders.filter((o) => o.status.toLowerCase() === "in-transit"),
    },
    {
      label: "Completed",
      path: "completed",
      orders: orders.filter((o) => o.status.toLowerCase() === "completed"),
    },
  ];
  const activeTab = tabs.find((tab) => tab.path === tabPath) || tabs[0];
  return (
    <div className={styles.orderWrapper}>
      <nav className={styles.orderNavigation}>
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={`/account/order/${tab.path}`}
            className={({ isActive }) =>
              isActive
                ? `${styles.active} ${styles.navItem}`
                : `${styles.navItem}`
            }
          >
            {tab.label}
            <span className={styles.line}></span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.body}>
        <ListOrder listOrder={activeTab.orders} loadingOrder={loadingOrder} />
      </div>
    </div>
  );
}
