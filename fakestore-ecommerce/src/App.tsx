import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AuthPage from "./pages/AuthPage";
import UserProfile from "./pages/UserProfile";
import OrderHistory from "./pages/OrderHistory";
import ProductManagement from "./pages/ProductManagement";
import { useCartSync } from "./hooks/useCartSync";
import "./debug-env"; // Temporary debug import

export default function App() {
  useCartSync();

  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path = "/" element = {<Home />} />
          <Route path = "/cart" element = {<CartPage />} />
          <Route path = "/checkout" element = {<CheckoutPage />} />
          <Route path = "/auth" element = {<AuthPage />} />
          <Route path = "/profile" element = {<UserProfile />} />
          <Route path = "/orders" element = {<OrderHistory />} />
          <Route path = "/products" element = {<ProductManagement />} />
        </Routes>
      </main>
    </div>
  );
}
