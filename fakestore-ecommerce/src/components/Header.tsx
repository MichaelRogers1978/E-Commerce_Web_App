import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useAuth0 } from '@auth0/auth0-react';

export default function Header() {
    const items = useSelector((state: RootState) => state.cart.items);
    const total = items.reduce((sum: number, i: any) => sum + i.quantity, 0);
    const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

    return (
        <header className = "header">
            <div className = "header-content">
                <Link to = "/">Fake Store</Link>
                <div className = "right">
                    <Link to = "/cart">Cart ({total})</Link>

                    {isLoading ? (
                        <span>Loading...</span>
                    ) : isAuthenticated ? (
                        <>
                            <span style = {{ marginLeft: "1rem"}}>
                                {user?.name?.split(" ")[0]} 
                            </span>
                            <img
                            src = {user?.picture}
                            alt = {user?.name}
                            style = {{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                marginLeft: "8px",
                            }} 
                        />
                        <button
                            className = "button small"
                            onClick = {() => 
                                logout({ logoutParams: {returnTo: window.location.origin } })
                                }
                            style = {{ marginLeft: "8px" }}
                        >
                            Log Out 
                        </button>
                        </>
                    ) : (
                        <button className = "button small" onClick = {() => loginWithRedirect()}>
                            Log In
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}