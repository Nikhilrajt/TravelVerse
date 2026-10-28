import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../redux/slices/authSlice";

function Navbar(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    function handleLogout(){
        dispatch(logOut());
        navigate("/login")
    }
return (
    <nav className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

            <Link
                to="/productlist"
                className="text-2xl font-bold tracking-tight text-slate-900"
            >
                TravelVerse
            </Link>

            <div className="flex items-center gap-8">
                <Link
                    to="/productlist"
                    className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
                >
                    Products
                </Link>

                <Link
                    to="/wishlist"
                    className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
                >
                    Wishlist
                </Link>

                <Link
                    to="/cart"
                    className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
                >
                    Cart
                </Link>

                <Link
                    to="/orders"
                    className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
                >
                    Orders
                </Link>

                <button
                    onClick={handleLogout}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                    Logout
                </button>
            </div>

        </div>
    </nav>
);
}
export default Navbar;