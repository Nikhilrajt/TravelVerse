import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
import { getProducts } from "../../services/productServices";

const initialState = {
    products:[],
    loading:false,
    error:null
};
export const fetchProducts =  createAsyncThunk(
    "products/fetchProducts",
    async ()=>{
        const products = await getProducts();
        return products;
    }
)
const productSlice = createSlice({
    name:"product",
    initialState:initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchProducts.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchProducts.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=action.payload;
        })
        .addCase(fetchProducts.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message;
        })
    }
})
export default productSlice.reducer;
