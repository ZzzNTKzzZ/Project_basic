import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./useUserContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, setUser } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const cartId = user.cart?._id;
  useEffect(() => {
    const cartItemsData = user.cart?.items || [];
    setCartItems(cartItemsData);
  }, [user]);

  const updateCart = (product, select = {}, quantity) => {
    setCartItems((prev) => {
      return prev.map((item) => {
        const sameProduct =
          item._id === product._id &&
          JSON.stringify(item.variants) === JSON.stringify(product.variants);

        if (sameProduct) {
          const updatedVariants = { ...item.variants };
          Object.keys(select).forEach((key) => {
            updatedVariants[key] = select[key];
          });

          return {
            ...item,
            variants: updatedVariants,
            quantity: quantity,
          };
        }

        return item;
      });
    });
  };

  const addToCart = async (product) => {
    // update UI instantly
    const existing = cartItems.find(
      (item) =>
        item._id === product._id &&
        JSON.stringify(item.variants) === JSON.stringify(product.variants)
    );
    setCartItems((prev) => {
      if (existing) {
        return prev.map((item) =>
          item._id === product._id &&
          JSON.stringify(item.variants) === JSON.stringify(product.variants)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [product, ...prev];
    });


    // send request to backend
    try {
      const res = await fetch(`http://localhost:5000/cart/${cartId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          variants: product.variants,
          quantity: product.quantity || 1,
        }),
      });

      const data = await res.json();
      // backend returns updated items
      setCartItems(data.items);

      // sync user data cart
      setUser((prev) => ({
        ...prev,
        cart: { ...prev.cart, items: data.items },
      }));

      return data;
    } catch (error) {
      console.error("Failed to add cart items", error);
    }
  };

  const removeFromCart = async (product) => {
  // 1. Update UI immediately
  setCartItems((prev) =>
    prev.filter(
      (item) =>
        !(
          item._id === product._id &&
          JSON.stringify(item.variants) === JSON.stringify(product.variants)
        )
    )
  );

  try {
    // 2. Send full info to backend
    const res = await fetch(`http://localhost:5000/cart/${cartId}/items`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product._id,
      }),
    });

    const data = await res.json();

    // 3. Update user.cart with NEW items from backend
    setUser((prev) => ({
      ...prev,
      cart: { ...prev.cart, items: data.items },
    }));

    return data;
  } catch (error) {
    console.log("Failed to delete cart items", error);
  }
};

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.length;

  const value = {
    cartItems,
    setCartItems,
    updateCart,
    addToCart,
    removeFromCart,
    clearCart,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
