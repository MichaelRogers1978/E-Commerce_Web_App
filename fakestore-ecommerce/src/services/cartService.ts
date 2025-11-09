import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import type { CartItem } from '../types';

export const cartService = {
    async saveCart(userId: string, cartItems: CartItem[]) {
    try {
        await setDoc(doc(db, 'carts', userId), {
        items: cartItems,
        updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error saving cart to Firebase:', error);
    }
},

async loadCart(userId: string): Promise<CartItem[]> {
    try {
        const cartDoc = await getDoc(doc(db, 'carts', userId));
        if (cartDoc.exists()) {
        return cartDoc.data().items || [];
        }
    return [];
    } catch (error) {
        console.error('Error loading cart from Firebase:', error);
        return [];
    }
},

async clearCart(userId: string) {
    try {
        await deleteDoc(doc(db, 'carts', userId));
    } catch (error) {
        console.error('Error clearing cart from Firebase:', error);
    }
    }
};
