import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./src/redux/slices/productSlice";
import authReducer from "./src/redux/slices/authSlice";
import cartReducer from "./src/redux/slices/cartSlice";
import wishlistReducer from "./src//redux/slices/wishlistSlice";
import orderReducer from "./src/redux/slices/orderSlice";

export const store = configureStore({
    reducer:{
      product:productReducer,
      auth:authReducer,
      cart:cartReducer,
      wishlist:wishlistReducer,
      order: orderReducer
    }
})