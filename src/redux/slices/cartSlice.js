import { createSlice } from "@reduxjs/toolkit";
import { getCart, saveCart } from "../../utils/cartStorage";

const initialState = {
    items: [],
    totalItems: 0
};

const cartSlice = createSlice({
    name: "cart",
    initialState,

    reducers: {
        loadCart: (state, action) => {
            const cart = getCart(action.payload);

            state.items = cart.items;
            state.totalItems = cart.totalItems;
        },

        addItem: (state, action) => {
            const { userId, ...newItem } = action.payload;

            const existingItem = state.items.find(
                (item) =>
                    item.productId === newItem.productId &&
                    item.size === newItem.size &&
                    item.color === newItem.color
            );

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.items.push(newItem);
            }

            state.totalItems += newItem.quantity;

            saveCart(userId, {
                items: state.items,
                totalItems: state.totalItems
            });
        },

        removeItem: (state, action) => {
            const { userId, ...deleteItem } = action.payload;

            const existingItem = state.items.find(
                (item) =>
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

            saveCart(userId, {
                items: state.items,
                totalItems: state.totalItems
            });
        },

        updateQuantity: (state, action) => {
            const {
                userId,
                productId,
                size,
                color,
                quantity
            } = action.payload;

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

                saveCart(userId, {
                    items: state.items,
                    totalItems: state.totalItems
                });
            }
        }
    }
});

export const {
    loadCart,
    addItem,
    removeItem,
    updateQuantity
} = cartSlice.actions;

export default cartSlice.reducer;