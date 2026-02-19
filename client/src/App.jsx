import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Layout } from "./layout/layout";
import { Register } from "./pages/auth/Register";
import { Login } from "./pages/auth/Login";
import { ContextProvider } from "./context/AuthContext";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <ContextProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />} />
            <Route index element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </ContextProvider>
    </>
  );
}

export default App;
