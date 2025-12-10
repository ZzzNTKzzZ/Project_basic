import { useState, useEffect, useRef } from "react";
import styles from "./CartPage.module.scss";
import { useCart } from "../../Hook/useCartContext";
import { Arrow, Cross } from "../../Assets";
import useClickOutside from "../../Hook/useClickOutSide";
import QuantitySelector from "../ProductDetail/Quantity";
import VariantSelectorPopup from "./VariantSelectorPopup";

export default function CartRow({ product, isChecked, onToggleItem }) {
  const { updateCart, removeFromCart } = useCart();

  // product.product contains the real product data populated from backend
  const {
    name,
    image,
    price,
    salePrice,
    isOnSale,
    variations
  } = product.product;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(product.variants);
  const [quantity, setQuantity] = useState(product.quantity);

  const popupRef = useRef(null);
  useClickOutside(popupRef, () => setIsPopupOpen(false), isPopupOpen);

  // Update cart when variants or quantity changes
  useEffect(() => {
    updateCart(product, selectedOptions, quantity);
  }, [selectedOptions, quantity]);

  const handleOptionSelect = (key, value) => {
    setSelectedOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className={styles.cartItem}>
      {/* Checkbox */}
      <div className={styles.checkboxContainer}>
        <label>
          <input
            type="checkbox"
            className="checkboxInput"
            checked={isChecked}
            onChange={(e) => onToggleItem(e.target.checked, product)}
          />
        </label>

        {/* Product Info */}
        <div className={styles.product}>
          <div className={styles.img}>
            <img
              src={`http://localhost:5000${image}`}
              alt={name}
            />
          </div>
          <p className={styles.name}>{name}</p>
        </div>
      </div>

      {/* Variants */}
      <div className={styles.variant} ref={popupRef}>
        <div
          className={styles.content}
          onClick={() => setIsPopupOpen(!isPopupOpen)}
        >
          <p>Variant</p>
          <Arrow
            className={`${styles.arrowIcon} ${
              isPopupOpen ? styles.active : ""
            }`}
          />
        </div>

        <div className={styles.variantOptions}>
          {Object.values(product.variants).join(", ")}
        </div>

        {isPopupOpen && (
          <VariantSelectorPopup
            variations={variations}
            selectedOptions={selectedOptions}
            onSelectOption={handleOptionSelect}
          />
        )}
      </div>

      {/* Unit Price */}
      <div className={styles.unitPrice}>
        {(isOnSale ? salePrice : price)?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </div>

      {/* Quantity */}
      <div className={styles.quantity}>
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      </div>

      {/* Total Amount */}
      <div className={styles.amount}>
        {((isOnSale ? salePrice : price) * quantity).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </div>

      {/* Remove */}
      <div className={styles.actions} onClick={() => removeFromCart(product)}>
        <Cross />
      </div>
    </section>
  );
}
