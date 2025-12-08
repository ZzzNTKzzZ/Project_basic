import { useState, useEffect } from "react";
import styles from "./CartPage.module.scss";
import { useCart } from "../../Hook/useCartContext";
import { useCheckOut } from "../../Hook/useCheckOutContext";
import { useNavigate } from "react-router-dom";
import CartRow from "./CartRow";
import Button from "../../Components/Button";


// BUG : Quantity item change price amount not change
// BUG : Two item having same id delete one of them it will deleta both

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  const { setCheckOutItems } = useCheckOut();

  const [selectedItems, setSelectedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();

  const handleToggleItem = (checked, item) => {
    setSelectedItems((prev) =>
      checked
        ? [...prev, item]
        : prev.filter(
            (i) =>
              !(
                i._id === item._id &&
                JSON.stringify(i.variants) === JSON.stringify(item.variants)
              )
          )
    );
  };

  const handleToggleAll = (checked) => {
    setIsAllChecked(checked);
    setSelectedItems(checked ? cartItems : []);
  };

  const handleBuy = () => {
    if (selectedItems.length === 0) {
      alert("Choose Item");
      return;
    }
    setCheckOutItems(selectedItems);
    navigate("/checkout");
  };

  const handleDelete = () => {
    selectedItems.forEach((item) => {
      setSelectedItems((prev) => prev.filter((i) => i._id !== item._id && JSON.stringify(i.variants) !== JSON.stringify(item.variants)));
      removeFromCart(item);
    });
  };

  useEffect(() => {
    const allSelected =
      cartItems.length > 0 && selectedItems.length === cartItems.length;
    setIsAllChecked(allSelected);
    setAmount(() => {

      return selectedItems.reduce(
        (total, item) =>
          total +
        (item.product.isOnSale
          ? item.product.salePrice
          : item.product.price) *
          item.quantity,
          0
        )
      }
    );
  }, [selectedItems, cartItems]);



  return (
    <div className={styles.wrapper}>
      <div className="container">
        <div className={styles.list}>
          <div className={styles.header}>
            <div className={styles.checkboxContainer}>
              <label>
                <input
                  type="checkbox"
                  className="checkboxInput"
                  checked={isAllChecked}
                  onChange={(e) => handleToggleAll(e.target.checked)}
                />
              </label>
              <div className={styles.product}>Product</div>
            </div>
            <div></div>
            <div className={styles.unitPrice}>Price</div>
            <div className={styles.quantity}>Quantity</div>
            <div className={styles.amount}>Amount</div>
            <div className={styles.actions}>Actions</div>
          </div>

          <div className={styles.body}>
            {cartItems.map((item, index) => (
              <CartRow
                key={`${item._id}-${JSON.stringify(item.variants)}-${index}`}
                product={item}
                isChecked={selectedItems.some(
                  (p) =>
                    p._id === item._id &&
                    JSON.stringify(p.variants) === JSON.stringify(item.variants)
                )}
                onToggleItem={handleToggleItem}
              />
            ))}
          </div>
        </div>

        <div className={styles.access}>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={isAllChecked}
              onChange={(e) => handleToggleAll(e.target.checked)}
              className="checkboxInput"
            />
            <div className={styles.allItems}>
              Select All ({selectedItems.length})
            </div>
            <div className={styles.deleteItem} onClick={handleDelete}>
              Delete
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.totalItem}>
              Total({selectedItems.length} product):
              {amount.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </div>
            <Button className={styles.buy} onClick={handleBuy}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
