import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";
import {
    addToWishlist,
    removeFromWishlist
} from "../redux/slices/wishlistSlice";

function ProductCard({ product }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);
    const wishlistItems = useSelector((state) => state.wishlist.items);

    const isWishlisted = wishlistItems.some(
        (item) => item.id === product.id
    );

    const handleWishlist = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!user) {
            navigate("/login");
            return;
        }

        if (isWishlisted) {
            dispatch(
                removeFromWishlist({
                    product,
                    userId: user.id
                })
            );
        } else {
            dispatch(
                addToWishlist({
                    product,
                    userId: user.id
                })
            );
        }
    };

    const handleAddToCart = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!user) {
            navigate("/login");
            return;
        }

        if (product.stock === 0) {
            return;
        }

        const cartItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            size: product.sizes?.[0] || "",
            color: product.colors?.[0] || "",
            image: product.image
        };

        dispatch(
            addItem({
                ...cartItem,
                userId: user.id
            })
        );

        navigate("/checkout");
    };

    return (
        <Link to={`/product/${product.id}`}>
            <div className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

                <div className="relative h-40 overflow-hidden bg-stone-100 sm:h-56">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {product.featured && (
                        <span className="absolute left-2 top-2 rounded-full bg-black px-2 py-1 text-[10px] font-semibold text-white sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
                            Featured
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={handleWishlist}
                        aria-label={
                            isWishlisted
                                ? `Remove ${product.name} from wishlist`
                                : `Add ${product.name} to wishlist`
                        }
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-lg shadow-md transition hover:scale-110 sm:right-3 sm:top-3 sm:h-10 sm:w-10 sm:text-xl"
                    >
                        <span
                            className={
                                isWishlisted
                                    ? "text-red-500"
                                    : "text-stone-500"
                            }
                        >
                            {isWishlisted ? "♥" : "♡"}
                        </span>
                    </button>
                </div>

                <div className="p-3 sm:p-5">

                    <p className="mb-1 text-xs font-medium text-stone-500 sm:mb-2 sm:text-sm">
                        {product.category}
                    </p>

                    <h3 className="mb-2 line-clamp-2 min-h-10 text-sm font-semibold text-stone-900 sm:min-h-12 sm:text-lg">
                        {product.name}
                    </h3>

                    <div className="mb-2 flex items-center gap-1 sm:mb-3 sm:gap-2">
                        <span className="text-xs font-medium text-stone-700 sm:text-sm">
                            ★ {product.rating}
                        </span>

                        <span className="text-xs text-stone-400 sm:text-sm">
                            ({product.reviewCount})
                        </span>
                    </div>

                    <p className="text-base font-bold text-stone-900 sm:text-xl">
                        ₹{product.price.toLocaleString("en-IN")}
                    </p>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="mt-3 w-full rounded-lg bg-stone-900 px-2 py-2.5 text-xs font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300 sm:mt-5 sm:px-4 sm:py-3 sm:text-base"
                    >
                        {product.stock === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;