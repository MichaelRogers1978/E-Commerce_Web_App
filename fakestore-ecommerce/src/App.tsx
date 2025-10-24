import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path = "/" element = {<Home />} />
          <Route path = "/cart" element = {<CartPage />} />
          <Route path = "/checkout" element = {<CheckoutPage />} />
        </Routes>
      </main>
    </div>
  );
}
