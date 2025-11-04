import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import OrderForm from "../components/forms/OrderForm";
import type { RootState } from "../store";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const { isAuthenticated } = useFirebaseAuth();
    const [done, setDone] = useState(false);

    if (cartItems.length === 0 && !done) {
        return (
            <div className = "container">
                <h1>Checkout</h1>
                <p>Your cart is empty. <a href="/">Continue shopping</a></p>
            </div>
        );
    }

    return (
        <div className = "container">
            <h1>Checkout</h1>

            {!isAuthenticated ? (
                <div>
                    <p>Please log in to complete your order.</p>
                    <button className = "button" onClick = {() => navigate("/auth")}>
                        Log In
                    </button>
                </div>
            ) : done ? (
                <>
                <p>Purchase complete. Your cart is clear.</p>
                <button className = "button" onClick = {() => navigate("/")}>
                    Back to Shop
                </button>
                <button className = "button" onClick = {() => navigate("/orders")} style = {{ marginLeft: "1rem" }}>
                    View Orders
                </button>
                </>
            ) : (
                <OrderForm onOrderComplete = {() => setDone(true)} />
            )}
        </div>
    );
}