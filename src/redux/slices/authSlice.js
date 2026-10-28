import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { createUser, checkEmail, checkUsername, findUser } from "../../services/authService";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
}

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const existingEmail = await checkEmail(userData.email);
            if (existingEmail.length > 0) {
                return rejectWithValue("Email already exists")
            }
            const existingUsername = await checkUsername(userData.username);
            if (existingUsername.length > 0) {
                return rejectWithValue("Username already exists");
            }
            const { confirmPassword, ...newUser } = userData;

            const createdUser = await createUser({
                ...newUser,
                avatar: "",
                createdAt: new Date().toISOString()
            })
            return createdUser;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const users = await findUser(email);
            if (users.length === 0) {
                return rejectWithValue("Invalid email or password");
            }
            const user = users[0];
            if (user.password !== password) {
                return rejectWithValue("Invalid email or password");
            }
            const {password: _,...safeUser} = user;
            return safeUser;
        }
        catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message
            )
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        loggedIn: (state, action) => {
            state.user = action.payload
            state.isAuthenticated = true
            state.loading = false
            state.error = null
        },
        logOut: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.loading = false
            state.error = null
            localStorage.removeItem("user");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginUser.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(loginUser.fulfilled,(state,action)=>{
                state.loading=false;
                state.user=action.payload;
                state.isAuthenticated=true;
                state.error=null;
                localStorage.setItem("user",JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected,(state,action)=>{
             state.loading=false;
             state.error=action.payload;
            })
    }
})

export const { loggedIn, logOut } = authSlice.actions;
export default authSlice.reducer;