import { useSelector } from "react-redux";
import type { RootState } from "../store";
import CartItem from "../components/CartItem";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage() {
    const items = useSelector((state: RootState) => state.cart.items);
    const navigate = useNavigate();

    const totalItems = items.reduce((s: number, i: any) => s + i.quantity, 0);
    const totalPrice = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);

    return (
        <div className = "container">
            <h1>Shopping Cart</h1>
            {items.length === 0 ? (
                <p>
                    Your cart is empty. <Link to = "/">Continue shopping</Link>
                </p>
            ) : (
                <>
                {items.map((i: any) => (
                    <CartItem key = {i.id} item = {i} />
                ))}
                <div className = "total">
                    <p>Total Items: {totalItems}</p>
                    <p>Total Price: ${totalPrice.toFixed(2)}</p>
                    <button className = "button" onClick = {() => navigate("/checkout")}>
                        Checkout
                    </button>
                </div>
            </>
            )}
        </div>
    );
}