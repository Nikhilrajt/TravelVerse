
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../services/api";

export const fetchAdminProducts = createAsyncThunk(
    "adminData/fetchProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/products");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addAdminProduct = createAsyncThunk(
    "adminData/addProduct",
    async (product, { rejectWithValue }) => {
        try {
            const response = await api.post("/products", product);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateAdminProduct = createAsyncThunk(
    "adminData/updateProduct",
    async ({ id, product }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/products/${id}`, product);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteAdminProduct = createAsyncThunk(
    "adminData/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/products/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAdminUsers = createAsyncThunk(
    "adminData/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/users");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleUserBlock = createAsyncThunk(
    "adminData/toggleUserBlock",
    async ({ id, isBlocked }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/users/${id}`, { isBlocked });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAdminOrders = createAsyncThunk(
    "adminData/fetchOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/orders");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    "adminData/updateOrderStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/orders/${id}`, { status });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    products: [],
    users: [],
    orders: [],
    loading: false,
    error: null
};

const adminDataSlice = createSlice({
    name: "adminData",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.products = action.payload;
            })
            .addCase(fetchAdminUsers.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(fetchAdminOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
            })

            .addCase(addAdminProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            .addCase(updateAdminProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(
                    (item) => item.id == action.payload.id
                );
                if (index !== -1) state.products[index] = action.payload;
            })
            .addCase(deleteAdminProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(
                    (item) => item.id != action.payload
                );
            })

            .addCase(toggleUserBlock.fulfilled, (state, action) => {
                const index = state.users.findIndex(
                    (user) => user.id == action.payload.id
                );
                if (index !== -1) state.users[index] = action.payload;
            })

            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const index = state.orders.findIndex(
                    (order) => order.id == action.payload.id
                );
                if (index !== -1) state.orders[index] = action.payload;
            })

            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) =>
                    action.type.startsWith("adminData/") &&
                    (action.type.endsWith("/fulfilled") ||
                     action.type.endsWith("/rejected")),
                (state, action) => {
                    state.loading = false;
                    if (action.type.endsWith("/rejected")) {
                        state.error = action.payload || action.error.message;
                    }
                }
            );
    }
});

export default adminDataSlice.reducer;
