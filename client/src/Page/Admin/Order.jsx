import { useEffect, useState } from "react";
import { Eyes, Pen, Trash } from "../../Assets";
import Breadcrumb from "../../Components/BreadCrumb";
import Button from "../../Components/Button";
import InputBar from "../../Components/InputBar";
import Pagination from "../../Components/Pagination";
import styles from "./Admin.module.scss";

export default function OrderAdmin() {
  const [orders, setOrders] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch("http://localhost:5000/order");
      const data = await res.json();

      setOrders(data);
      setLoading(false);
    };
    fetchOrder();
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.orderWrapper}>
      <div className={styles.header}>
        <h2>Order List</h2>
        <Breadcrumb />
      </div>
      <div className={`${styles.tableStatistics} ${styles.order}`}>
        <div className={styles.note}>
          Tip search by Product ID: Each product is provided with a unique ID,
          which you can rely on to find the exact product you need.
        </div>
        <span className={styles.groupAction}>
          <InputBar className={styles.search} />
          <Button className={styles.add}>+ Add new</Button>
        </span>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>OrderId</div>
            <div>User</div>
            <div>Quantity</div>
            <div>Price</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          <div className={styles.tableBody}>
            {orders.map((order) => (
              <div className={styles.tableRow} key={order._id}>
                <div>{order._id.slice(12)}</div>
                <div>{order.user.name}</div>
                <div>
                  {order.orderItems.reduce((total, item) => {
                    return total + item.quantity;
                  }, 0)}
                </div>
                <div>
                  {order.price.toLocaleString("vi-VN", {
                    styles: "currency",
                    currency: "VND",
                  })}
                </div>
                <div className={`${styles.statusBadge} ${styles[order.status]}`}>
                  {order.status}
                </div>
                <div className={styles.action}>
                  <Eyes />
                  <Pen />
                  <Trash />
                </div>
              </div>
            ))}
          </div>
          <Pagination totalIndex={5} currentIndex={1} />
        </div>
      </div>
    </div>
  );
}
