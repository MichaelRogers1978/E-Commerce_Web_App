import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";

interface Product {
    id: number;
    title: string;
    price: number;
    category: string;
    description: string;
    image: string;
    rating: { rate: number };
}

export default function ProductCard({ product }: {product: Product }) {
    const dispatch = useDispatch();

    const handleAdd = () => {
        dispatch(
            addToCart({
                id: product.id, 
                title: product.title,
                price: product.price,
                image: product.image,
            })
        );
    };

    return (
        <div className = "card">
            <img
                src = {product.image}
                alt = {product.title}
                onError = {(e) =>
                ((e.target as HTMLImageElement).src = 
                "https://via.placeholder.com/300x300?text=No+Image")
                }
            />
            <h3>{product.title}</h3>
            <p>${product.price.toFixed(2)}</p>
            <small>{product.category}</small>
            <p>{product.description.slice(0, 100)}...</p>
            <div>{product.rating?.rate ?? "N/A"}</div>
            <button className = "button small" onClick = {handleAdd}>
                Add to Cart
            </button>
        </div>
    );
}