import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchAllUsers,updateUserStatus } from "../../../services/authService"

const initialState = {
    users:[],
    loading:false,
    error:null,
    updatingUserId:null
}
export const fetchAdminUsers = createAsyncThunk(
    "fetchAllUsers/users",
    async ()=>{
       const users = await fetchAllUsers();
       return users;
    }
);
export const updateAdminUserStatus = createAsyncThunk(
    "updateUserStatus/users",
    async ({userId, isBlocked}, {rejectWithValue})=>{
       try {
           const user = await updateUserStatus(userId, isBlocked);
           return user;
       } catch (error) {
           return rejectWithValue(
               error.response?.data?.message || error.message || "Unable to update user status"
           );
       }
    }
)
const adminUserSlice = createSlice({
    name:"adminUsers",
    initialState:initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchAdminUsers.pending,(state,action)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAdminUsers.fulfilled,(state,action)=>{
            state.users = action.payload;
            state.loading = false;
        })
        .addCase(fetchAdminUsers.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(updateAdminUserStatus.pending,(state,action)=>{
            state.updatingUserId = action.meta.arg.userId;
            state.error = null;
        })
        .addCase(updateAdminUserStatus.fulfilled,(state,action)=>{
            const index = state.users.findIndex(
                (user)=>String(user.id) === String(action.payload.id));
                if(index !== -1){
                state.users[index] = action.payload;
                }
            state.updatingUserId = null;
        })
        .addCase(updateAdminUserStatus.rejected,(state,action)=>{
            state.updatingUserId = null;
            state.error = action.payload || action.error.message;
        })
    }
})
export default adminUserSlice.reducer;
