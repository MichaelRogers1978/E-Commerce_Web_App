import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFirebaseAuth } from './useFirebaseAuth';
import { cartService } from '../services/cartService';
import { loadCartFromFirebase } from '../store/cartSlice';
import type { RootState } from '../store';

export const useCartSync = () => {
    const { user, isAuthenticated } = useFirebaseAuth();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();


useEffect(() => {
    const loadUserCart = async () => {
        if (isAuthenticated && user?.uid) {
        try {
            const savedCart = await cartService.loadCart(user.uid);
            if (savedCart.length > 0) {
            dispatch(loadCartFromFirebase(savedCart));
            }
        } catch (error) {
        console.error('Error loading cart from Firebase:', error);
        }
    }
    };

    loadUserCart();
    }, [isAuthenticated, user?.uid, dispatch]);

useEffect(() => {
    const saveUserCart = async () => {
if (isAuthenticated && user?.uid && cartItems.length > 0) {
        try {
    await cartService.saveCart(user.uid, cartItems);
        } catch (error) {
        console.error('Error saving cart to Firebase:', error);
        }
        }
    };

    const timeoutId = setTimeout(saveUserCart, 1000);
    return () => clearTimeout(timeoutId);
}, [cartItems, isAuthenticated, user?.uid]);

    return {
    isAuthenticated,
    user,
    cartItems
    };
};