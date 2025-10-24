import { useDispatch } from "react-redux";
import { removeFromCart,
    updateQuantity,
    type CartItem as Item,
} from "../store/cartSlice";

export default function CartItem({ item}: { item: Item }) {
    const dispatch = useDispatch();

    return (
        <div className = "cart-row">
            <img
                src = {item.image}
                alt = {item.title}
                onError = {(e) =>
                ((e.target as HTMLImageElement).src =
                "https://via.placeholder.com/150")
                }
            />
            <div style = {{ flex: 1 }}>
                <div>{item.title}</div>
                <div>${item.price.toFixed(2)}</div>
                <div className = "quantity-controls">
                    <button
                        className = "small quantity-btn"
                        onClick = {() =>
                            dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1}))
                        }
                        disabled = {item.quantity <= 1}
                    >
                        -
                    </button>
                    <span className = "quantity-display">{item.quantity}</span>
                    <button
                        className = "small quantity-btn"
                        onClick = {() =>
                            dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1}))
                        }
                    >
                        +
                    </button>
                </div>
            </div>
            <button className = "small" onClick = {() => dispatch(removeFromCart(item.id))}>
                Remove
            </button>
        </div>
    );
}