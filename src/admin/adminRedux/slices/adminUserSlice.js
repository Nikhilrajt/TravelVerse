import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchAllUsers,updateUserStatus } from "../../../services/authService"

const initialState = {
    users:[],
    loading:false,
    error:null
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
    async ({userId, isBlocked})=>{
       const user = await updateUserStatus(userId, isBlocked);
       return user;
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
        .addCase(updateAdminUserStatus.fulfilled,(state,action)=>{
            const index = state.users.findIndex(
                (user)=>user.id === action.payload.id);
                if(index !== -1){
                state.users[index] = action.payload;
                }
        })
    }
})
export default adminUserSlice.reducer;