import { useSelector,useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { useEffect } from "react";

function ProductLoader(){
    const products = useSelector((state)=>state.product.products);
    const isLoading = useSelector((state)=>state.product.loading);
    const error = useSelector((state)=>state.product.error);
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(fetchProducts())
    },[])
    if(isLoading){
        return <p>Loading...</p>
    }
    if(error){
        return <p>{error}</p>
    }
    return(
        <div>
         <h1>Products</h1>
         {products.map((product)=>(
            <div key={product.id}>
                <h4>{product.name}</h4>
            </div>
         ))}
        </div>
    )
}
export default ProductLoader;