import { useNavigate, NavLink } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useCartContext } from "../../context/CartContext";
import { Layout } from "../../layout/layout";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./Order.css";

export const Order = () => {
  const { cartItems, refreshCart } = useCartContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("CREDITCARD");
  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8000/api/v1/auth/orderCart",
        { paymentMethod, status: "PENDING" },
        { withCredentials: true }
      );
      await refreshCart();
      toast.success("¡Orden creada exitosamente!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al crear la orden");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="order-empty">
          <p>No hay productos para ordenar</p>
          <span className="order-empty-hint">
            Agrega productos a tu carrito antes de hacer checkout.
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
      <div className="order-page">
        <div className="order-header">
          <NavLink to="/cart" className="order-back-link">
            ← Volver al carrito
          </NavLink>
          <h2>Confirmar Orden</h2>
        </div>

        <div className="order-layout">
          <div className="order-details">
            <section className="order-section">
              <h3>Datos del cliente</h3>
              <div className="order-client-info">
                <div className="client-row">
                  <span className="client-label">Nombre</span>
                  <span className="client-value">{user?.name}</span>
                </div>
                <div className="client-row">
                  <span className="client-label">Email</span>
                  <span className="client-value">{user?.email}</span>
                </div>
              </div>
            </section>

            <section className="order-section">
              <h3>Método de pago</h3>
              <div className="payment-options">
                <label
                  className={`payment-option ${
                    paymentMethod === "CREDITCARD" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CREDITCARD"
                    checked={paymentMethod === "CREDITCARD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-option-content">
                    <span className="payment-icon">💳</span>
                    <div>
                      <span className="payment-name">Tarjeta de crédito</span>
                      <span className="payment-desc">
                        Visa, Mastercard, Amex
                      </span>
                    </div>
                  </div>
                </label>

                <label
                  className={`payment-option ${
                    paymentMethod === "PAYPAL" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PAYPAL"
                    checked={paymentMethod === "PAYPAL"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-option-content">
                    <span className="payment-icon">🅿️</span>
                    <div>
                      <span className="payment-name">PayPal</span>
                      <span className="payment-desc">Pago rápido y seguro</span>
                    </div>
                  </div>
                </label>
              </div>
            </section>

            <section className="order-section">
              <h3>
                Productos <span className="item-count">({totalItems})</span>
              </h3>
              <div className="order-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="order-item-info">
                      <span className="order-item-name">
                        {item.product.name}
                      </span>
                      <span className="order-item-qty">× {item.quantity}</span>
                    </div>
                    <span className="order-item-price">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="order-summary">
            <h3>Resumen del pedido</h3>

            <div className="summary-details">
              <div className="summary-line">
                <span>Subtotal ({totalItems} productos)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Envío</span>
                <span className="free-shipping">Gratis</span>
              </div>
              <div className="summary-line">
                <span>Método de pago</span>
                <span>
                  {paymentMethod === "CREDITCARD"
                    ? "Tarjeta de crédito"
                    : "PayPal"}
                </span>
              </div>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <button
              className="btn-place-order"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Procesando...
                </span>
              ) : (
                "Confirmar Orden"
              )}
            </button>

            <p className="order-disclaimer">
              Al confirmar, aceptas nuestros términos y condiciones de compra.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
