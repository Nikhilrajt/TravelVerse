import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../redux/slices/wishlistSlice";
import { useNavigate } from "react-router-dom";

function Wishlist() {
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRemove = (product) => {
        dispatch(
            removeFromWishlist({
                product,
                userId: user.id
            })
        );
    };

    const handleMoveToCart = (product) => {
        navigate(`/product/${product.id}`);
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="text-center">
                    <div className="mb-4 text-5xl sm:text-6xl">♡</div>

                    <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">
                        Your Wishlist is Empty
                    </h2>

                    <p className="mt-2 text-sm text-stone-500 sm:text-base">
                        Save your favorite products here for later.
                    </p>

                    <button
                        onClick={() => navigate("/productlist")}
                        className="mt-6 rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 sm:px-6 sm:text-base"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">

            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
                    My Wishlist
                </h1>

                <p className="mt-2 text-sm text-stone-500 sm:text-base">
                    {wishlistItems.length}{" "}
                    {wishlistItems.length === 1 ? "item" : "items"} saved
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {wishlistItems.map((product) => (
                    <div
                        key={product.id}
                        className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-40 w-full object-cover sm:h-56"
                        />

                        <div className="p-3 sm:p-5">

                            <p className="text-xs text-stone-500 sm:text-sm">
                                {product.category}
                            </p>

                            <h2 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold text-stone-900 sm:min-h-12 sm:text-lg">
                                {product.name}
                            </h2>

                            <p className="mt-2 text-base font-bold text-stone-900 sm:text-xl">
                                ₹{product.price.toLocaleString("en-IN")}
                            </p>

                            <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row">

                                <button
                                    onClick={() => handleMoveToCart(product)}
                                    className="w-full rounded-lg bg-stone-900 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-stone-800 sm:flex-1 sm:px-4 sm:text-sm"
                                >
                                    Move to Cart
                                </button>

                                <button
                                    onClick={() => handleRemove(product)}
                                    className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 sm:w-auto sm:px-4 sm:text-sm"
                                >
                                    Remove
                                </button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Wishlist;