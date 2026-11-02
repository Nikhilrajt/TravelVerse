import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const displayName =
        user?.fullName?.trim() || user?.username || user?.email || "User";
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <nav className="border-b border-stone-200 bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">

                <Link
                    to="/productlist"
                    className="text-2xl font-bold tracking-tight text-stone-900"
                >
                    TravelVerse
                </Link>

                <div className="flex w-full items-center justify-between gap-3 overflow-x-auto sm:w-auto sm:gap-8">

                    <NavLink
                        to="/productlist"
                        className={({ isActive }) =>
                            `whitespace-nowrap text-sm font-medium transition ${
                                isActive
                                    ? "text-orange-800"
                                    : "text-stone-600 hover:text-orange-900"
                            }`
                        }
                    >
                        Products
                    </NavLink>

                    <NavLink
                        to="/wishlist"
                        className={({ isActive }) =>
                            `whitespace-nowrap text-sm font-medium transition ${
                                isActive
                                    ? "text-orange-800"
                                    : "text-stone-600 hover:text-orange-900"
                            }`
                        }
                    >
                        Wishlist
                    </NavLink>

                    <NavLink
                        to="/cart"
                        className={({ isActive }) =>
                            `whitespace-nowrap text-sm font-medium transition ${
                                isActive
                                    ? "text-orange-800"
                                    : "text-stone-600 hover:text-orange-900"
                            }`
                        }
                    >
                        Cart
                    </NavLink>

                    <NavLink
                        to="/orders"
                        className={({ isActive }) =>
                            `whitespace-nowrap text-sm font-medium transition ${
                                isActive
                                    ? "text-orange-800"
                                    : "text-stone-600 hover:text-orange-900"
                            }`
                        }
                    >
                        Orders
                    </NavLink>

                    {isAuthenticated && (
                        <NavLink
                            to="/profile"
                            aria-label={`${displayName}'s profile`}
                            title={`${displayName}'s profile`}
                            className={({ isActive }) =>
                                `flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                                    isActive
                                        ? "bg-orange-800 text-white"
                                        : "bg-stone-100 text-stone-700 hover:bg-amber-100 hover:text-orange-900"
                                }`
                            }
                        >
                            {initial}
                        </NavLink>
                    )}

                </div>
            </div>
        </nav>
    );
}

export default Navbar;