import { AltImage } from "../../Assets";
import styles from "./Cart.module.scss";

export default function CartItem({ item = { name: "Name", price: 2000, image: "" } }) {
  return (
  <div className={styles.CartItemWrapper}>
    <div className={styles.left}>
        <img src={`http://localhost:5000${item.image}`} alt="" />
        {item.name}
    </div>
    <div className={styles.right}>
        {item.price}$
    </div>
  </div>
  );
}
