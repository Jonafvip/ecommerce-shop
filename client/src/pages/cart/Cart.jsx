import { useCartContext } from "../../context/CartContext";
import { Layout } from "../../layout/layout";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import "./Cart.css";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export const Cart = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } =
    useCartContext();
  const [loadingId, setLoadingId] = useState(null);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  const handleQuantity = async (productId, qty, stock) => {
    if (qty < 1) return removeFromCart(productId);
    if (qty > stock)
      return toast.error("Stock máximo alcanzado", { id: "stock" });
    setLoadingId(productId);
    try {
      await updateQuantity(productId, qty);
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setLoadingId(null);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="cart-empty">
          <p>Tu carrito está vacío</p>
          <span className="cart-empty-hint">
            ¡Explora nuestros productos y encuentra algo que te encante!
          </span>
          <NavLink to="/" className="btn-back-store">
            Ir a la tienda
          </NavLink>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="cart-page">
        <h2>Carrito</h2>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <strong>{item.product.name}</strong>
                  <span className="cart-item-price">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>

                <div className="cart-item-actions">
                  <div className="qty-control">
                    <button
                      disabled={loadingId === item.productId}
                      onClick={() =>
                        handleQuantity(
                          item.productId,
                          item.quantity - 1,
                          item.product.stock
                        )
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      disabled={
                        loadingId === item.productId ||
                        item.quantity >= item.product.stock
                      }
                      onClick={() =>
                        handleQuantity(
                          item.productId,
                          item.quantity + 1,
                          item.product.stock
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn-remove"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    Eliminar
                  </button>
                </div>

                {item.quantity >= item.product.stock && (
                  <small className="stock-warn">Stock máximo</small>
                )}
              </div>
            ))}

            <button className="btn-clear" onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>

          <div className="cart-summary">
            <h3>Resumen</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <Stack spacing={2} direction="row">
              <NavLink to="/order">
                <Button variant="contained">Checkout</Button>
              </NavLink>
            </Stack>
          </div>
        </div>
      </div>
    </Layout>
  );
};
