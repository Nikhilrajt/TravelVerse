import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Star } from "lucide-react";
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
    const cart = useSelector((state) => state.cart.items);

    const quantityInCart = cart.reduce(
        (total, item) =>
            String(item.productId) === String(product.id)
                ? total + Number(item.quantity)
                : total,
        0
    );
    const remainingStock = Math.max(0, Number(product.stock) - quantityInCart);

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

        if (remainingStock < 1) {
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

        
    };

    return (
        <article className="h-full">
            <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

                <div className="relative aspect-square overflow-hidden bg-surface-muted">
                    <Link to={`/product/${product.id}`} className="block h-full w-full" aria-label={`View ${product.name}`}>
                        <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-contain p-4 sm:p-5"
                        />
                    </Link>

                    {product.featured && (
                        <span className="absolute left-2 top-2 rounded-sm bg-brand px-2 py-1 text-[10px] font-semibold text-white sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
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
                        className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white/95 shadow-sm transition hover:border-accent hover:text-accent sm:right-3 sm:top-3"
                    >
                        <Heart
                            size={19}
                            aria-hidden="true"
                            className={isWishlisted ? "fill-error text-error" : "text-stone-500"}
                        />
                    </button>
                </div>

                <div className="flex grow flex-col p-3 sm:px-5 sm:py-5">

                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-stone-500 sm:mb-2 sm:text-sm">
                        {product.category}
                    </p>

                    <Link to={`/product/${product.id}`} className="mb-2 rounded-sm focus-visible:outline">
                        <h3 className="line-clamp-2 min-h-10 font-serif text-base font-semibold leading-snug text-stone-900 transition-colors group-hover:text-brand sm:min-h-12 sm:text-lg">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="mb-2 flex items-center gap-1 sm:mb-3 sm:gap-2">
                        <span className="flex items-center gap-1 text-xs font-medium text-stone-700 sm:text-sm">
                        <Star size={14} className="fill-accent text-accent" aria-hidden="true" /> {product.rating}
                        </span>

                        <span className="text-xs text-stone-400 sm:text-sm">
                            ({product.reviewCount})
                        </span>
                    </div>

                    <p className="mb-3 text-base font-semibold text-stone-900 sm:mb-4 sm:text-xl">
                        ₹{product.price.toLocaleString("en-IN")}
                    </p>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={Number(product.stock) === 0 || remainingStock < 1}
                        className="mt-auto min-h-11 w-full rounded-md bg-brand px-3 py-2.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-brand-hover focus-visible:outline disabled:cursor-not-allowed disabled:bg-stone-300 sm:px-4 sm:text-sm"
                    >
                        {Number(product.stock) === 0
                            ? "Out of Stock"
                            : remainingStock < 1
                                ? "Stock in Cart"
                                : "Add to Cart"}
                    </button>
                    {quantityInCart > 0 && remainingStock > 0 && (
                        <p className="mt-2 text-center text-xs text-stone-500">
                            {quantityInCart} in cart · {remainingStock} available
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}

export default ProductCard;
