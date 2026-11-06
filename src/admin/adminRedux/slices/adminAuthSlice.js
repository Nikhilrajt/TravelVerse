import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminLogin } from "../../services/adminAuthService";

export const adminLoginThunk = createAsyncThunk(
    "adminAuth/adminLoginThunk",
    async ({ username, password }, { rejectWithValue }) => {
        try {
            return await adminLogin(username, password);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const initialState = {
    admin : JSON.parse(localStorage.getItem("adminSession")) || null,
    loading : false,
    error : null
}

const adminAuthSlice =  createSlice({
    name:"adminAuth",
    initialState:initialState,
    reducers:{
        adminLogout:(state)=>{
            state.admin = null;
            localStorage.removeItem("adminSession");
        }
    },
    extraReducers: (builder)=>{
        builder
        .addCase(adminLoginThunk.pending,(state)=>{
           state.loading = true;
           state.error = null;
        })
        .addCase(adminLoginThunk.fulfilled,(state,action)=>{
            state.loading = false;
            state.admin = action.payload;
            localStorage.setItem("adminSession",JSON.stringify(action.payload));
        })
        .addCase(adminLoginThunk.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload || action.error.message;
        })
    }
})
export const {adminLogout} =  adminAuthSlice.actions;
export default adminAuthSlice.reducer;