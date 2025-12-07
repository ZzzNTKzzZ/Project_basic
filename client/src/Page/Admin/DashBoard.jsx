import styles from "./Admin.module.scss";
import { useOutletContext } from "react-router-dom";

function DataBox({ dataType, data, icon }) {
  return (
    <div className={styles.dataBoxWrapper}>
      <p className={styles.name}>{dataType}</p>
      <span className={styles.icon}>{icon}</span>
      <p className={styles.data}>{data}</p>
    </div>
  );
}

export default function DashBoard() {
  const { generalData, loading } = useOutletContext();

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.dashBoardWrapper}>
      <h2>Dash board</h2>
      <div className={styles.general}>
        <DataBox
          dataType={"Total User"}
          data={generalData.totalUser}
          icon={""}
        />
        <DataBox
          dataType={"Total Sale"}
          data={generalData.totalSale}
          icon={""}
        />
        <DataBox
          dataType={"Total Order"}
          data={generalData.totalOrder}
          icon={""}
        />
        <DataBox
          dataType={"Total Pending"}
          data={generalData.totalPending}
          icon={""}
        />
      </div>
      <div className={`${styles.tableStatistics} ${styles.bestSelling}`}>
        <h2>Best-Selling Products</h2>

        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>Product</div>
            <div>Sold</div>
            <div>Revenue (VND)</div>
          </div>

          <div className={styles.tableBody}>
            {generalData.bestSeller.map((product) => (
              <div className={styles.tableRow} key={product._id}>
                <div>{product.name}</div>
                <div>{product.sold}</div>
                <div>
                  {(product.sold * product.price).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`${styles.tableStatistics} ${styles.latestOrders}`}>
        <h2>Latest Orders</h2>

        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>Order ID</div>
            <div>User</div>
            <div>Total</div>
            <div>Status</div>
          </div>

          <div className={styles.tableBody}>
            {generalData.latestOrder.map((order) => (
              <div className={styles.tableRow} key={order._id}>
                <div>{order._id}</div>
                <div>{order.user.name}</div>
                <div>
                  {order.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </div>
                <div
                  className={`${styles.statusBadge} ${styles[order.status]}`}
                >
                  {order.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
