import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../redux/slices/wishlistSlice";
import { useNavigate } from "react-router-dom";

function Wishlist() {
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRemove = (product) => {
        dispatch(removeFromWishlist(product));
    };

    const handleMoveToCart = (product) => {
        navigate(`/product/${product.id}`);
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 text-6xl">♡</div>

                    <h2 className="text-2xl font-bold text-gray-900">
                        Your Wishlist is Empty
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Save your favorite products here for later.
                    </p>

                    <button
                        onClick={() => navigate("/productlist")}
                        className="mt-6 rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    My Wishlist
                </h1>

                <p className="mt-2 text-gray-500">
                    {wishlistItems.length}{" "}
                    {wishlistItems.length === 1 ? "item" : "items"} saved
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {wishlistItems.map((product) => (
                    <div
                        key={product.id}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-56 w-full object-cover"
                        />

                        <div className="p-5">
                            <p className="text-sm text-gray-500">
                                {product.category}
                            </p>

                            <h2 className="mt-1 text-lg font-semibold text-gray-900">
                                {product.name}
                            </h2>

                            <p className="mt-2 text-xl font-bold text-gray-900">
                                ₹{product.price.toLocaleString("en-IN")}
                            </p>

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => handleMoveToCart(product)}
                                    className="flex-1 rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white transition hover:bg-gray-800"
                                >
                                    Move to Cart
                                </button>

                                <button
                                    onClick={() => handleRemove(product)}
                                    className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-100"
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