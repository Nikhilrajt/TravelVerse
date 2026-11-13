import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../../services/productServices";

const initialState = {
    products: [],
    loading: false,
    error: null
};
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async () => {
        const products = await getProducts();
        return products;
    }
)
export const addNewProduct = createAsyncThunk(
    "products/addNewProduct",
    async (newData) => {
        const newProduct = await addProduct(newData);
        return newProduct;
    }
)
export const updateExistingProduct = createAsyncThunk(
    "products/updateExistingProduct",
    async ({ productId, updatedData }) => {
        const updatedProduct = await updateProduct(productId, updatedData);
        return updatedProduct;
    }
);
export const removeProduct = createAsyncThunk(
    "products/removeProduct",
    async (productId) => {
        const deletedId = await deleteProduct(productId);
        return deletedId;
    }
);
const productSlice = createSlice({
    name: "product",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = [...action.payload].reverse();
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addNewProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNewProduct.fulfilled, (state, action) => {
                state.products.unshift(action.payload);
                state.loading = false;
            })
            .addCase(addNewProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateExistingProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExistingProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(
                    (product) => product.id === action.payload.id
                );

                if (index !== -1) {
                    state.products[index] = action.payload;
                }

                state.loading = false;
            })
            .addCase(updateExistingProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(removeProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(
                    (product) => product.id !== action.payload
                );
                state.loading = false;
            })
            .addCase(removeProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
})
export default productSlice.reducer;
