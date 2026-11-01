import { createSlice } from "@reduxjs/toolkit";
import { getWishlist, saveWishlist } from "../../utils/wishlistStorage";

const wishlistSlice = createSlice({
    name: "wishlist",

    initialState: {
        items: []
    },

    reducers: {
        loadWishlist: (state, action) => {
            const wishlist = getWishlist(action.payload);

            state.items = wishlist.items;
        },

        addToWishlist: (state, action) => {
            const { product, userId } = action.payload;

            const exists = state.items.some(
                (item) => item.id === product.id
            );

            if (exists) {
                return;
            }

            state.items.push(product);

            saveWishlist(userId, {
                items: state.items
            });
        },

        removeFromWishlist: (state, action) => {
            const { product, userId } = action.payload;

            state.items = state.items.filter(
                (item) => item.id !== product.id
            );

            saveWishlist(userId, {
                items: state.items
            });
        }
    }
});

export const {
    loadWishlist,
    addToWishlist,
    removeFromWishlist
} = wishlistSlice.actions;

export default wishlistSlice.reducer;