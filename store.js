import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./src/redux/slices/productSlice";
import authReducer from "./src/redux/slices/authSlice";
export const store = configureStore({
    reducer:{
      product:productReducer,
      auth:authReducer
    }
})