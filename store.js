import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./src/redux/slices/productSlice";
export const store = configureStore({
    reducer:{
      product:productReducer
    }
})