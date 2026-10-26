import { useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { useEffect } from "react";

function ProductLoader(){
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(fetchProducts())
    },[])
   return null;
}
export default ProductLoader;