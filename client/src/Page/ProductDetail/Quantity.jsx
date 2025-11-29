import styles from "./ProductDetail.module.scss";

export default function QuantitySelector({ quantity, setQuantity }) {
  const decrease = () => setQuantity((prev) => Math.max(prev - 1, 1));
  const increase = () => setQuantity((prev) => prev + 1);
  const onChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setQuantity(isNaN(val) || val <= 0 ? 1 : val);
  };

  return (
    <div className={styles.quantityWrapper}>
      <span
        className={`${styles.decrease} ${
          quantity === 1 ? styles.disabled : ""
        }`}
        onClick={decrease}
      >
        -
      </span>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={onChange}
        className={styles.quantityInput}
      />
      <span className={styles.increase} onClick={increase}>
        +
      </span>
    </div>
  );
}
