import Register from "./pages/Register";
import Login from "./pages/Login";
import ProductList from "./components/ProductList";
import { Routes, Route, Navigate } from "react-router-dom";
import ProductLoader from "./components/ProductLoader";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loggedIn, authInitialized } from "./redux/slices/authSlice";
import WishList from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ShopLayout from "./layouts/ShopLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import Checkout from "./pages/checkOut";
import { loadCart } from "./redux/slices/cartSlice";
import { loadWishlist } from "./redux/slices/wishlistSlice";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminProtectedRoute from "./admin/routes/AdminprotectedRoute";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminLayout from "./admin/layouts/AdminLayout";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminAddProduct from "./admin/pages/AdminAddProduct";
import AdminEditProduct from "./admin/pages/AdminEditProduct";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminOrders from "./admin/pages/AdminOrders";


function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            const user = JSON.parse(savedUser);

            dispatch(loggedIn(user));
            dispatch(loadCart(user.id));
            dispatch(loadWishlist(user.id));
        } else {
            dispatch(authInitialized());
        }
    }, [dispatch]);

    return (
        <>
            <ProductLoader />
            <Routes>
                <Route path="/" element={<Navigate to="/productlist" replace />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                <Route element={<AdminProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route
                            path="/admin/dashboard"
                            element={<AdminDashboard />}
                        />
                        <Route
                            path="/admin/products"
                            element={<AdminProducts />}
                        />
                        <Route
                            path="/admin/products/add"
                            element={<AdminAddProduct />}
                        />
                        <Route
                            path="/admin/products/edit/:id"
                            element={<AdminEditProduct />}
                        />
                        <Route
                            path="/admin/users"
                            element={<AdminUsers />}
                        />
                        <Route
                            path="/admin/orders"
                            element={<AdminOrders />}
                        />
                    </Route>
                </Route>
                <Route element={<ShopLayout />}>
                    <Route path="/productlist" element={<ProductList />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="product/:id" element={<ProductDetails />} />
                        <Route path="/wishlist" element={<WishList />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Route>
            </Routes>

        </>
    );
}

export default App;
