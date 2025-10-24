import { useDispatch } from "react-redux";
import { clearCart } from "../store/cartSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loginWithRedirect, user} = useAuth0();
    const [done, setDone] = useState(false);

    const handleCheckout = () => {
        if (!isAuthenticated) {
            loginWithRedirect();
            return;
        }
        dispatch(clearCart());
        sessionStorage.removeItem("cart");
        setDone(true);
    };

    return (
        <div className = "container">
            <h1>Checkout</h1>

            {isAuthenticated && (
                <p>
                    You're checking out as<strong>{user?.email}</strong>
                </p>
            )}

            {done ? (
                <>
                <p>Purchase complete. Your cart is clear.</p>
                <button className = "button" onClick = {() => navigate("/")}>
                    Back to Shop
                </button>
                </>
            ) : (
                <button className = "button" onClick = {handleCheckout}>
                    Confirm Checkout
                </button>
            )}
        </div>
    );
}