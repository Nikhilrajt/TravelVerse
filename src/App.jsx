import Register from "./pages/Register";
import Login from "./pages/Login";
import ProductList from "./components/ProductList";
import { Routes, Route, Navigate } from "react-router-dom";
import ProductLoader from "./components/ProductLoader";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loggedIn } from "./redux/slices/authSlice";
import WishList from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ShopLayout from "./layouts/ShopLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetails from "./pages/ProductDetails";

function App() {
    const dispatch = useDispatch();
    useEffect(()=>{
       const savedUser = localStorage.getItem("user");
       if(savedUser){
        const user = JSON.parse(savedUser);
        dispatch(loggedIn(user));
       }
    },[dispatch])
    return (
        <>
        <ProductLoader />
        <Routes>
            <Route path="/" element={<Navigate to="/productlist" replace />}/>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ShopLayout />}>
            <Route path="/productlist" element={<ProductList />}/>
            <Route path="product/:id" element={<ProductDetails />}/>
            <Route element={<ProtectedRoute />}>
            <Route path="/wishlist" element={<WishList />}/>
            <Route path="/cart" element={<Cart />}/>
            <Route path="/orders" element={<Orders />}/>
            </Route>
            </Route>
        </Routes>
        
        </>
    );
}

export default App;