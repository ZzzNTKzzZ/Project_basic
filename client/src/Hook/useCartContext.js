import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./useUserContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartItemsData = user.cart?.items || [];
        const formatted = cartItemsData.map((item) => ({
          _id: item.product?._id,
          name: item.product?.name,
          price: item.product?.price,
          image: item.product?.image,
          variations: item.product?.variations,
          quantity: item.quantity,
          variants: item.variants,
        }));
        setCartItems(formatted);

      } catch (err) {
        console.error("Fetch user failed:", err);
      }
    };
    fetchData();
  }, [ user ]);

  // Using in Cart Page
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

  const addToCart = (product) => {
    console.log("product", product)
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item._id === product._id &&
          JSON.stringify(item.variants) === JSON.stringify(product.variants)
      );
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          variations: product.variations,
          variants: product.variants,
          image: product.image,
          quantity: product.quantity || 1,
        },
        ...prev,
      ];
    });
  };

  const removeFromCart = (product) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          item._id !== product._id &&
          JSON.stringify(item.variants) !== JSON.stringify(product.variants)
      )
    );
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
