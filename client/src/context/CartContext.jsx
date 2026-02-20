import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuthContext } from "./AuthContext";

const CartContext = createContext();

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext debe usarse dentro de un CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [cartItems, setCartItems] = useState([]);
  const userIdRef = useRef(null);

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/auth/cart",
        { withCredentials: true }
      );
      setCartItems(response.data.data);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = async (productId) => {
    await axios.post(
      `http://localhost:8000/api/v1/auth/cart/${productId}`,
      {},
      { withCredentials: true }
    );
    fetchCart();
  };

  const updateQuantity = async (productId, quantity) => {
    await axios.put(
      `http://localhost:8000/api/v1/auth/cart/${productId}`,
      { quantity },
      { withCredentials: true }
    );
    fetchCart();
  };

  // Solo ejecutar fetchCart cuando el ID del usuario realmente cambia
  useEffect(() => {
    const currentUserId = user?.id ?? null;
    if (currentUserId !== userIdRef.current) {
      userIdRef.current = currentUserId;
      fetchCart();
    }
  }, [user]);

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/auth/cart/${productId}`,
        { withCredentials: true }
      );
      fetchCart();
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:8000/api/v1/auth/cart", {
        withCredentials: true,
      });
      fetchCart();
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
    }
  };

  const value = {
    cartItems,
    cartCount,
    refreshCart: fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
