import { useEffect, useState } from "react";
import { Location } from "../../Assets";
import { useCheckOut } from "../../Hook/useCheckOutContext";
import { useUser } from "../../Hook/useUserContext";
import styles from "./CheckOut.module.scss";
import Button from "../../Components/Button";
import { useNavigate } from "react-router-dom";

function CheckOutItem({ item }) {
  return (
    <section className={styles.checkoutItem}>
      <div className={styles.product}>
        <div className={styles.image}>
          <img src={`http://localhost:5000${item.image}`} alt="" />
        </div>
        <p className={styles.productName}>{item.name}</p>
      </div>
      <div className={styles.variants}>
        {Object.values(item.variants).join(", ")}
      </div>
      <div className={styles.price}>{item.price}</div>
      <div className={styles.quantity}>{item.quantity}</div>
      <div className={styles.amount}>
        {(item.quantity * parseInt(item.price.replace(/[^\d]/g, ""), 10)).toLocaleString("vi-VN") + " ₫"}
      </div>
    </section>
  );
}

export default function CheckOut() {
  const paymentMethods = ["Cash on Delivery", "E-wallet"];
  const { checkoutItems, setCheckOutItems } = useCheckOut();
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  
  console.log(checkoutItems)
  
  const totalPrice = checkoutItems.reduce(
    (prev, cur) => (prev +=  parseInt(cur.price.replace(/[^\d]/g, ""), 10) * cur.quantity),
    0
  );
  const totalShippingFee = 0;
  const totalPayment = totalPrice + totalShippingFee;

const handleCheckOut = async () => {
  try {
    if (!checkoutItems || checkoutItems.length === 0) {
      console.warn("No items to checkout");
      return;
    }

    // Map checkoutItems to the format expected by the backend
    const orderItems = checkoutItems.map(item => {
      console.log(item)
      return {
      product: item._id,      // product ID
      quantity: item.quantity,
      variants: item.variants
    }});

    const body = {
      user: user._id, // from your useUser() context
      orderItems
    };

    // Send POST request to backend
    const response = await fetch("http://localhost:5000/order/createOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Checkout failed:", errorData);
      return;
    }

    const data = await response.json();
    console.log("Order created successfully:", data);

    navigate("/account/order")    
    setCheckOutItems([]);
  } catch (error) {
    console.error("Checkout error:", error);
  }
};
  useEffect(() => {
    setLoading(false);
  }, [checkoutItems]);

  if (loading) return <div>Loadding.</div>;
  return (
    <div className={styles.wrapper}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.title}>
            <span className={styles.icon}>
              <Location />
            </span>
            <h2>Delivery Address</h2>
          </div>
          <div className={styles.infoUser}>
            <div className={styles.name}>{user.name}</div>
            <div className={styles.phone}>({user.phone})</div>
            <div className={styles.address}>{user.location}</div>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.list}>
            <div className={styles.product}>Products</div>
            <div className={styles.price}>Price</div>
            <div className={styles.quantity}>Quantity</div>
            <div className={styles.amount}>Amount</div>
          </div>
          <div className={styles.items}>
            {checkoutItems.map((item) => (
              <CheckOutItem item={item} key={item._id} />
            ))}
          </div>
          <span className={styles.line}></span>
        </div>
        <div className={styles.pay}>
          <div className={styles.headerPay}>
            <section className={styles.c1}>
              <h2>Payment method</h2>
            </section>
            <section className={styles.paymentMethod}>
              <p>{paymentMethod}</p>
            </section>
            <section className={styles.changePaymentBtn}>
              <button>
                <p>Change</p>
              </button>
            </section>
          </div>
          <span className={styles.line}></span>
          <div className={styles.priceList}>
            <div></div>
            <span>Total price</span>
            <div className={styles.price}>{totalPrice}₫</div>
            <div></div>
            <span>Total shipping fee</span>
            <div className={styles.price}>{totalShippingFee}₫ </div>
            <div></div>
            <span>Total payment</span>
            <div className={`${styles.price} ${styles.totalPayment}`}>
              {totalPayment}₫
            </div>
          </div>
          <span className={styles.line}></span>
          <div className={styles.order}>
            <Button className={styles.orderBtn} onClick={handleCheckOut}>
              Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
