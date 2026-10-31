import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOrdersByUser } from "../../services/orderService";

const initialState = {
    orders: [],
    loading: false,
    error: null
};

export const fetchOrders = createAsyncThunk(
    "orders/fetchOrders",
    async (userId, { rejectWithValue }) => {
        try {
            const orders = await getOrdersByUser(userId);
            return orders;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

const orderSlice = createSlice({
    name: "orders",
    initialState,

    reducers: {
        addOrder: (state, action) => {
            state.orders.unshift(action.payload);
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })

            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { addOrder } = orderSlice.actions;

export default orderSlice.reducer;