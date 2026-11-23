import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../redux/slices/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

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
                <div className="w-full max-w-lg rounded-lg border border-stone-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
                    <div className="mb-4 flex justify-center text-stone-400">
                        <Heart size={56} strokeWidth={1.5} aria-hidden="true" />
                    </div>

                    <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">
                        Your Wishlist is Empty
                    </h2>

                    <p className="mt-2 text-sm text-stone-500 sm:text-base">
                        Save your favorite products here for later.
                    </p>

                    <button
                        onClick={() => navigate("/productlist")}
                        className="mt-6 min-h-11 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover sm:px-6 sm:text-base"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">

            <div className="mb-7 flex flex-col gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:mb-9 sm:flex-row sm:items-end sm:justify-between sm:p-8">
                <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brand">Saved for later</p>
                    <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
                        My Wishlist
                    </h1>

                    <p className="mt-2 text-sm text-stone-500 sm:text-base">
                        {wishlistItems.length}{" "}
                        {wishlistItems.length === 1 ? "item" : "items"} saved
                    </p>
                </div>
                <p className="max-w-sm text-sm leading-6 text-stone-500">Your saved essentials, ready for the journey ahead.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {wishlistItems.map((product) => (
                    <div
                        key={product.id}
                        className="group flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="aspect-square w-full bg-surface-muted object-contain p-4 sm:p-5"
                        />

                        <div className="flex grow flex-col p-4 sm:p-5">

                            <p className="text-xs text-stone-500 sm:text-sm">
                                {product.category}
                            </p>

                            <h2 className="mt-1 line-clamp-2 min-h-10 font-serif text-base font-semibold leading-snug text-stone-900 sm:min-h-12 sm:text-lg">
                                {product.name}
                            </h2>

                            <p className="mt-2 text-base font-bold text-stone-900 sm:text-xl">
                                ₹{product.price.toLocaleString("en-IN")}
                            </p>

                            <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row">

                                <button
                                    onClick={() => handleMoveToCart(product)}
                                    className="min-h-11 w-full rounded-md bg-brand px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-hover sm:flex-1 sm:px-4 sm:text-sm"
                                >
                                    Move to Cart
                                </button>

                                <button
                                    onClick={() => handleRemove(product)}
                                    className="min-h-11 w-full rounded-md border border-stone-300 px-3 py-2.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 sm:w-auto sm:px-4 sm:text-sm"
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
