import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

export default function Header() {
    const items = useSelector((state: RootState) => state.cart.items);
    const total = items.reduce((sum: number, i: any) => sum + i.quantity, 0);
    const { user, loading, logout, isAuthenticated } = useFirebaseAuth();

    return (
        <header className = "header">
            <div className = "header-content">
                <Link to = "/">Fake Store</Link>
                <div className = "right">
                    <Link to = "/cart">Cart ({total})</Link>

                    {loading ? (
                        <span>Loading...</span>
                    ) : isAuthenticated ? (
                        <>
                            <span className="user-display">
                                {user?.email?.split("@")[0]} 
                            </span>
                            <Link to = "/profile" style = {{ marginLeft: "8px" }}>Profile</Link>
                            <Link to = "/orders" style = {{ marginLeft: "8px" }}>Orders</Link>
                            <Link to = "/products" style = {{ marginLeft: "8px" }}>Products</Link>
                            <button
                                className = "button small"
                                onClick = {logout}
                                style = {{ marginLeft: "8px" }}
                            >
                                Log Out 
                            </button>
                        </>
                    ) : (
                        <Link className = "button small" to = "/auth">
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}