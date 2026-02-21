import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Layout } from "./layout/layout";
import { Register } from "./pages/auth/Register";
import { Login } from "./pages/auth/Login";
import { ContextProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import { Toaster } from "react-hot-toast";
import { Profile } from "./pages/Profile";
import { Cart } from "./pages/cart/Cart";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Order } from "./pages/cart/Order";

function App() {
  return (
    <>
      <ContextProvider>
        <CartProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />} />
              <Route index element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order"
                element={
                  <ProtectedRoute>
                    <Order />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </ContextProvider>
    </>
  );
}

export default App;
