import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { ClipboardList, Heart, Package, ShoppingBag } from "lucide-react";

function Navbar() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const totalItems = useSelector((state) => state.cart.totalItems);
    const displayName =
        user?.fullName?.trim() || user?.username || user?.email || "User";
    const initial = displayName.charAt(0).toUpperCase();

    const linkClass = ({ isActive }) =>
        `flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors duration-200 focus-visible:outline ${isActive
            ? "bg-surface-muted text-brand"
            : "text-stone-600 hover:bg-canvas hover:text-brand"
        }`;

    return (
        <header className="sticky top-0 z-40 border-b border-stone-200 bg-white shadow-sm">
            <div className="bg-brand px-4 py-1.5 text-center text-xs font-medium tracking-wide text-white">
                Thoughtful travel essentials for every journey
            </div>
            <nav aria-label="Primary navigation">
              <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <Link
                    to="/productlist"
                    className="w-fit font-serif text-2xl font-semibold tracking-tight text-brand"
                >
                    TravelVerse
                </Link>

                <div className="flex w-full flex-wrap items-center gap-1 sm:w-auto sm:gap-2">

                    <NavLink
                        to="/productlist"
                        className={linkClass}
                    >
                        <Package size={16} aria-hidden="true" />
                        Products
                    </NavLink>

                    <NavLink
                        to="/wishlist"
                        className={linkClass}
                    >
                        <Heart size={16} aria-hidden="true" />
                        Wishlist
                    </NavLink>

                    <NavLink
                        to="/cart"
                        className={({ isActive }) =>
                            `${linkClass({ isActive })} relative`
                        }
                    >
                        <ShoppingBag size={16} aria-hidden="true" />
                        Cart

                        {totalItems > 0 && (
                            <span className="absolute right-0 top-0 flex h-5 min-w-5 -translate-y-1/3 translate-x-1/3 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                                {totalItems}
                            </span>
                        )}
                    </NavLink>

                    <NavLink
                        to="/orders"
                        className={linkClass}
                    >
                        <ClipboardList size={16} aria-hidden="true" />
                        Orders
                    </NavLink>

                    {isAuthenticated && (
                        <NavLink
                            to="/profile"
                            aria-label={`${displayName}'s profile`}
                            title={`${displayName}'s profile`}
                            className={({ isActive }) =>
                                `flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-200 ${isActive
                                    ? "border-brand bg-brand text-white"
                                    : "border-stone-200 bg-stone-100 text-stone-700 hover:border-accent hover:text-brand"
                                }`
                            }
                        >
                            {initial}
                        </NavLink>
                    )}

                </div>
              </div>
            </nav>
        </header>
    );
}

export default Navbar;
