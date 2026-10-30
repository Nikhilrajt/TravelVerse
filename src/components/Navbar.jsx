import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

function Navbar() {

    const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
);

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

                    <NavLink
                        to="/productlist"
                        className={({ isActive }) =>
                            `text-sm font-medium transition ${
                                isActive
                                    ? "text-blue-600"
                                    : "text-slate-600 hover:text-blue-700"
                            }`
                        }
                    >
                        Products
                    </NavLink>

                    <NavLink
                        to="/wishlist"
                        className={({ isActive }) =>
                            `text-sm font-medium transition ${
                                isActive
                                    ? "text-blue-600"
                                    : "text-slate-600 hover:text-blue-700"
                            }`
                        }
                    >
                        Wishlist
                    </NavLink>

                    <NavLink
                        to="/cart"
                        className={({ isActive }) =>
                            `text-sm font-medium transition ${
                                isActive
                                    ? "text-blue-600"
                                    : "text-slate-600 hover:text-blue-700"
                            }`
                        }
                    >
                        Cart
                    </NavLink>

                    <NavLink
                        to="/orders"
                        className={({ isActive }) =>
                            `text-sm font-medium transition ${
                                isActive
                                    ? "text-blue-600"
                                    : "text-slate-600 hover:text-blue-700"
                            }`
                        }
                    >
                        Orders
                    </NavLink>

{isAuthenticated && (
    <NavLink
        to="/profile"
        className={({ isActive }) =>
            `text-sm font-medium transition ${
                isActive
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-700"
            }`
        }
    >
        Profile
    </NavLink>
)}

                </div>
            </div>
        </nav>
    );
}

export default Navbar;