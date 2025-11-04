import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

const loadCart = (): CartState => {
    try {
        const stored = sessionStorage.getItem("cart");
        return stored ? JSON.parse(stored) : { items: [] };

    } catch {
        return { items: [] };
    }
};

const initialState: CartState = loadCart();

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
            const existing = state.items.find((i) => i.id === action.payload.id);
            if (existing) existing.quantity += 1;
            else state.items.push({ ...action.payload, quantity: 1 });
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((i) => i.id !== action.payload);
        },
        updateQuantity: (
            state,
            action: PayloadAction<{ id: number; quantity: number }>
        ) => {
            const item = state.items.find((i) => i.id === action.payload.id);
            if (item) item.quantity = Math.max(0, action.payload.quantity);
            state.items = state.items.filter((i) => i.quantity > 0);
        },
        clearCart: (state) => {
            state.items = [];
        },
        loadCartFromFirebase: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, loadCartFromFirebase } = cartSlice.actions;
export default cartSlice.reducer;