import { useState, useEffect, useRef } from "react";
import styles from "./CartPage.module.scss";
import { useCart } from "../../Hook/useCartContext";
import Button from "../../Components/Button";
import { Arrow, Cross } from "../../Assets";
import useClickOutside from "../../Hook/useClickOutSide";
import QuantitySelector from "../ProductDetail/Quantity";
import { useCheckOut } from "../../Hook/useCheckOutContext";
import { useNavigate } from "react-router-dom";

/* ---------------- VariantSelectorPopup ---------------- */
function VariantSelectorPopup({ product, selectedOptions, onSelectOption }) {
  const variantKeys = Object.keys(product.variations || {});

  return (
    <div className={styles.variantPopup}>
      {variantKeys.map((key) => {
        const optionName = key.endsWith("s") ? key.slice(0, -1) : key;
        const options = product.variations[key];

        return (
          <div key={key} className={styles.variantBlock}>
            <span className={styles.variantLabel}>
              {optionName.charAt(0).toUpperCase() + optionName.slice(1)}
            </span>
            <div className={styles.optionGroup}>
              {options.map((value) => (
                <Button
                  key={value}
                  type={2}
                  className={styles.option}
                  active={value === selectedOptions[optionName]}
                  onClick={() => onSelectOption?.(optionName, value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- CartRow (single item) ---------------- */
function CartRow({ product, isChecked, onToggleItem }) {
  const { updateCart, removeFromCart } = useCart();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(product.variants);
  const [quantity, setQuantity] = useState(product.quantity);

  const popupRef = useRef(null);
  useClickOutside(popupRef, () => setIsPopupOpen(false), isPopupOpen);

  // Update cart when user changes quantity or variant
  useEffect(() => {
    updateCart(product, selectedOptions, quantity);
  }, [selectedOptions, quantity]);

  const handleOptionSelect = (key, value) => {
    setSelectedOptions((prev) => ({ ...prev, [key]: value }));
  };

  const togglePopup = () => setIsPopupOpen((prev) => !prev);

  useEffect(() => {
    console.log(product)
  }, [])

  return (
    <section className={styles.cartItem}>
      <div className={styles.checkboxContainer}>
        <label>
          <input
            type="checkbox"
            className={"checkboxInput"}
            checked={isChecked}
            onChange={(e) => onToggleItem(e.target.checked, product)}
          />
        </label>
      </div>

      <div className={styles.product}>
        <div className={styles.img}>
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
          />
        </div>
        <p className={styles.name}>{product.name}</p>
      </div>

      <div className={styles.variant} ref={popupRef}>
        <div className={styles.content} onClick={togglePopup}>
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
            product={product}
            selectedOptions={selectedOptions}
            onSelectOption={handleOptionSelect}
          />
        )}
      </div>

      <div className={styles.unitPrice}>{product.price}$</div>

      <div className={styles.quantity}>
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      </div>

      <div className={styles.amount}>{product.price * quantity}$</div>

      <div className={styles.actions} onClick={() => removeFromCart(product)}>
        {" "}
        <Cross />
      </div>
    </section>
  );
}

/* ---------------- CartPage (main component) ---------------- */
export default function CartPage() {
  const { cartItems } = useCart();
  const { setCheckOutItems } = useCheckOut();
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const navigate = useNavigate();
  // Handle toggle single item
  const handleToggleItem = (checked, item) => {
    setSelectedItems((prev) =>
      checked ? [...prev, item] : prev.filter((i) => i._id !== item._id)
    );
  };

  // Handle toggle select all
  const handleToggleAll = (checked) => {
    setIsAllChecked(checked);
    setSelectedItems(checked ? cartItems : []);
  };

  // Handle buy
  const handleBuy = () => {
    if(selectedItems.length === 0) {
      alert("Chosse Item")
      return;
    }
    setCheckOutItems(selectedItems);
    navigate("/checkout");
  };

  // Keep “select all” checkbox in sync with selected items
  useEffect(() => {
    const allSelected =
      cartItems.length > 0 && selectedItems.length === cartItems.length;
    setIsAllChecked(allSelected);
    console.log(selectedItems)
  }, [selectedItems, cartItems]);

  useEffect(() => {
    setSelectedItems((prev) =>
      prev.map(
        (selected) =>
          cartItems.find(
            (c) =>
              c._id === selected._id &&
              JSON.stringify(c.variants) === JSON.stringify(selected.variants)
          ) || selected
      )
    );
  }, [cartItems]);

  return (
    <div className={styles.wrapper}>
      <div className="container">
        <div className={styles.list}>
          {/* -------- Table Header -------- */}
          <div className={styles.header}>
            <div className={styles.checkboxContainer}>
              <label>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={isAllChecked}
                  onChange={(e) => handleToggleAll(e.target.checked)}
                />
              </label>
            </div>
            <div className={styles.product}>Product</div>
            <div className={styles.unitPrice}>Price</div>
            <div className={styles.quantity}>Quantity</div>
            <div className={styles.amount}>Amount</div>
            <div className={styles.actions}>Actions</div>
          </div>

          {/* -------- Cart Items -------- */}
          <div className={styles.body}>
            {cartItems.map((item) => (
              <CartRow
                key={`${item._id}-${JSON.stringify(item.variants)}`}
                product={item}
                isChecked={selectedItems.some((p) => p._id === item._id)}
                onToggleItem={handleToggleItem}
              />
            ))}
          </div>
        </div>
        {/* -------- Cart Access -------- */}
        <div className={styles.access}>
          <div className={styles.checkboxContainer}>
            <label>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={isAllChecked}
                onChange={(e) => handleToggleAll(e.target.checked)}
              />
            </label>
          </div>
          <div className={styles.allItems}>Select All ({cartItems.length})</div>
          <div className={styles.deleteItem}>Delete</div>
          <div className={styles.addToFav}>Save to Favorites</div>
          <div className={styles.totalItem}>
            Total({selectedItems.length} product):$
            {selectedItems
              .reduce((prev, item) => prev + item.price * item.quantity, 0)
              .toFixed(2)}
          </div>
          <Button className={styles.buy} onClick={handleBuy}>
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
