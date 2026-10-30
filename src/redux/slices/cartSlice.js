import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        totalItems: 0
    },
    reducers: {
        addItem: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find((item) =>
                item.productId === newItem.productId &&
                item.size === newItem.size &&
                item.color === newItem.color
            );
            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            }
            else {
                state.items.push(newItem);
            }
            state.totalItems += newItem.quantity;
        },
        removeItem: (state, action) => {
            const deleteItem = action.payload;
            const existingItem = state.items.find((item) =>
                item.productId === deleteItem.productId &&
                item.size === deleteItem.size &&
                item.color === deleteItem.color
            );
            if (existingItem) {
                state.totalItems -= existingItem.quantity;
                state.items = state.items.filter(
                    (item) => item !== existingItem
                );
            }
        },
        updateQuantity: (state, action) => {
            const { productId, size, color, quantity } = action.payload;

            const existingItem = state.items.find(
                (item) =>
                    item.productId === productId &&
                    item.size === size &&
                    item.color === color
            );

            if (existingItem) {
                const difference = quantity - existingItem.quantity;

                existingItem.quantity = quantity;
                state.totalItems += difference;
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
        }
    }
})
export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;