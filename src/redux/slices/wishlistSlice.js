import { createSlice } from "@reduxjs/toolkit";
import { getWishlist, saveWishlist } from "../../utils/wishlistStorage";

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: getWishlist(),

    reducers: {
        addToWishlist: (state, action) => {
            const exists = state.items.some(
                (item) => item.id === action.payload.id
            );

            if (exists) {
                return;
            }

            state.items.push(action.payload);

            saveWishlist({
                items: state.items
            });
        },

        removeFromWishlist: (state, action) => {
            const product = action.payload;

            state.items = state.items.filter(
                (item) => item.id !== product.id
            );

            saveWishlist({
                items: state.items
            });
        }
    }
});

export const {
    addToWishlist,
    removeFromWishlist
} = wishlistSlice.actions;

export default wishlistSlice.reducer;