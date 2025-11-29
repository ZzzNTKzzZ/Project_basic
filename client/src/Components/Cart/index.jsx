import { useEffect, useRef, useState } from "react";
import { Cross } from "../../Assets";
import { useCart } from "../../Hook/useCartContext";
import useClickOutside from "../../Hook/useClickOutSide";
import styles from "./Cart.module.scss";
import CartItem from "./CartItem";
import Button from "../Button";

export default function Cart({ setOpenCart }) {
  const cartRef = useRef(null);
  const { cartItems, totalItems } = useCart();

  return (
    <div
      className={styles.wrapper}
      ref={cartRef}
      onMouseEnter={() => setOpenCart(true)}
      onMouseLeave={() => setOpenCart(false)}
    >
      <div className={styles.header}>
        <h2>CART</h2>
      </div>
      <div className={styles.body}>
        {cartItems.length === 0 ? (
          <div className={styles.empty}>Nothing in your cart</div>
        ) : (
          <>
            {cartItems.map((item) => (
              <CartItem key={`${item._id}-${JSON.stringify(item.variants).toString()}`} item={item} />
            ))}
            <div className={styles.cartInfo}>
              {totalItems > 5 ? (
                <span className={styles.totalItems}>
                  {totalItems} item add into cart
                </span>
              ) : (
                ""
              )}
              <Button type={2} href={"/cart"}>See Cart</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
