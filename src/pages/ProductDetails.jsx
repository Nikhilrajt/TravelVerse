import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { addItem } from "../redux/slices/cartSlice";
import { Heart, Star } from "lucide-react";
import {
    addToWishlist,
    removeFromWishlist
} from "../redux/slices/wishlistSlice";

function ProductDetails() {
    const { id } = useParams();
    const products = useSelector((state) => state.product.products);
    const cart = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [sizeError, setSizeError] = useState("");
    const [colorError, setColorError] = useState("");
    const [cartError, setCartError] = useState("");
    const [cartSuccess, setCartSuccess] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const navigate = useNavigate();
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const user = useSelector((state) => state.auth.user);

    const currentProduct = products.find((product) => {
        return product.id === id;
    });

    if (!currentProduct) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center px-4 py-10">
                <section className="w-full max-w-lg rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-10">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">TravelVerse</p>
                    <h1 className="mt-3 font-serif text-2xl font-semibold text-brand sm:text-3xl">Product not found</h1>
                    <p className="mt-2 text-sm leading-6 text-stone-600">This item may no longer be available. Browse the collection to find something else for your trip.</p>
                    <Link to="/productlist" className="mt-6 inline-flex min-h-11 items-center rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover">Browse travel essentials</Link>
                </section>
            </main>
        );
    }

    const hasWishlist = wishlistItems.some(
        (item) => item.id === currentProduct.id
    );

    const quantityInCart = cart.reduce(
        (total, item) =>
            String(item.productId) === String(currentProduct.id)
                ? total + Number(item.quantity)
                : total,
        0
    );
    const remainingStock = Math.max(
        0,
        Number(currentProduct.stock) - quantityInCart
    );

    const handleAddToCart = () => {
        if (quantity > remainingStock) {
            setCartError(
                remainingStock === 0
                    ? "All available stock is already in your cart."
                    : `Only ${remainingStock} more item${remainingStock === 1 ? "" : "s"} can be added.`
            );
            return;
        }

        if (currentProduct.sizes?.length > 0 && !selectedSize) {
            setSizeError("Please select a size");
            return;
        }

        if (currentProduct.colors?.length > 0 && !selectedColor) {
            setColorError("Please select a color");
            return;
        }

        const cartItem = {
            productId: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            quantity,
            size: selectedSize,
            color: selectedColor,
            image: currentProduct.image
        };

        dispatch(
            addItem({
                ...cartItem,
                userId: user.id
            })
        );

        setSizeError("");
        setColorError("");
        setCartError("");
        setCartSuccess(true);
    };

    function handleWishlist() {
        if (!hasWishlist) {
            dispatch(
                addToWishlist({
                    product: currentProduct,
                    userId: user.id
                })
            );
        } else {
            dispatch(
                removeFromWishlist({
                    product: currentProduct,
                    userId: user.id
                })
            );
        }
    }

    return (
        <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 sm:py-9 lg:px-10">

            <div className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-brand sm:mb-7">
                TravelVerse <span className="mx-2 text-stone-400">/</span> {currentProduct.category}
            </div>
            <div className="grid items-start gap-4 md:grid-cols-[1.1fr_0.9fr] md:gap-8 lg:gap-10">

                <div className="flex aspect-square max-h-[680px] min-h-[280px] items-center justify-center overflow-hidden rounded-lg border border-stone-200 bg-surface-muted p-5 sm:p-10 md:sticky md:top-8">
                    <img
                        src={currentProduct.image}
                        alt={currentProduct.name}
                        className="max-h-[360px] w-full object-contain sm:max-h-[500px]"
                    />
                </div>

                <div className="flex flex-col rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">

                    <p className="mb-2 text-xs font-medium text-stone-500 sm:text-sm">
                        {currentProduct.category}
                    </p>

                    <h1 className="font-serif text-3xl font-medium leading-tight text-stone-900 sm:text-4xl">
                        {currentProduct.name}
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-stone-600 sm:mt-4 sm:text-base sm:leading-7">
                        {currentProduct.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-stone-100 py-5 sm:mt-6 sm:gap-6">
                        <h2 className="font-serif text-2xl font-semibold text-stone-900 sm:text-3xl">
                            ₹{currentProduct.price.toLocaleString("en-IN")}
                        </h2>

                        <div className="flex items-center gap-1 text-xs text-stone-600 sm:text-sm">
                            <Star size={16} className="fill-accent text-accent" aria-hidden="true" />
                            {currentProduct.rating}
                            <span>
                                ({currentProduct.reviewCount} reviews)
                            </span>
                        </div>
                    </div>

                    <div className="mt-4">
                        {currentProduct.stock === 0 ? (
                            <span className="inline-flex w-fit items-center rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
                                Out of Stock
                            </span>
                        ) : remainingStock === 0 ? (
                            <span className="inline-flex w-fit items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800">
                                All available stock is in your cart
                            </span>
                        ) : (
                            <span className="inline-flex w-fit items-center rounded-full bg-success-surface px-3 py-1 text-sm font-medium text-success">
                                {remainingStock} item{remainingStock === 1 ? "" : "s"} available to add
                            </span>
                        )}
                    </div>

                    <div className="my-5 border-t border-stone-200 sm:my-6" />

                    {currentProduct.sizes.length > 0 && (
                        <div>
                            <h2 className="mb-3 text-sm font-semibold text-stone-900 sm:text-base">
                                Size
                            </h2>

                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {currentProduct.sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        aria-pressed={selectedSize === size}
                                        onClick={() => {
                                            setSelectedSize(size);
                                            setSizeError("");
                                            setCartError("");
                                            setCartSuccess(false);
                                        }}
                                        className={`min-h-11 rounded-md border px-4 py-2 text-sm font-medium transition sm:px-5 ${selectedSize === size
                                            ? "border-brand bg-brand text-white"
                                            : "border-stone-300 bg-white text-stone-700 hover:border-accent"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}

                                {sizeError && (
                                    <p role="alert" className="w-full text-sm text-red-600">
                                        {sizeError}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {currentProduct.colors.length > 0 && (
                        <div className="mt-5 sm:mt-6">
                            <h2 className="mb-3 text-sm font-semibold text-stone-900 sm:text-base">
                                Color
                            </h2>

                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {currentProduct.colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        aria-pressed={selectedColor === color}
                                        onClick={() => {
                                            setSelectedColor(color);
                                            setColorError("");
                                            setCartError("");
                                            setCartSuccess(false);
                                        }}
                                        className={`min-h-11 rounded-md border px-4 py-2 text-sm font-medium transition sm:px-5 ${selectedColor === color
                                            ? "border-brand bg-brand text-white"
                                            : "border-stone-300 bg-white text-stone-700 hover:border-accent"
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}

                                {colorError && (
                                    <p role="alert" className="w-full text-sm text-red-600">
                                        {colorError}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {currentProduct.stock === 0 || remainingStock === 0 ? (
                        <div className={`mt-6 rounded-lg p-4 sm:mt-8 ${currentProduct.stock === 0 ? "bg-red-50" : "bg-amber-50"}`}>
                            <p className={`font-semibold ${currentProduct.stock === 0 ? "text-red-600" : "text-amber-800"}`}>
                                {currentProduct.stock === 0
                                    ? "This product is currently unavailable."
                                    : "All available stock is already in your cart."}
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 sm:mt-8">

                            <h2 className="mb-3 text-sm font-semibold text-stone-900 sm:text-base">
                                Quantity
                            </h2>

                            <div className="flex w-fit items-center overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                                <button
                                    onClick={() =>
                                        setQuantity((prev) => Math.max(1, prev - 1))
                                    }
                                    disabled={quantity <= 1}
                                    className="min-h-11 min-w-11 text-lg hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-12"
                                >
                                    −
                                </button>

                                <span className="min-w-10 border-x border-stone-300 px-3 py-2 text-center font-medium sm:min-w-12 sm:px-4">
                                    {quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        setQuantity((prev) => Math.min(remainingStock, prev + 1))
                                    }
                                    disabled={
                                        quantity >= remainingStock
                                    }
                                    className="min-h-11 min-w-11 text-lg hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-12"
                                >
                                    +
                                </button>
                            </div>

                            {cartError && (
                                <p role="alert" className="mt-3 text-sm text-red-600">
                                    {cartError}
                                </p>
                            )}
                            {cartSuccess && (
                                <p role="status" className="mt-3 rounded-md bg-success-surface px-3 py-2 text-sm font-medium text-success">
                                    Added to your cart.
                                </p>
                            )}
                            {quantityInCart > 0 && (
                                <p className="mt-2 text-sm text-stone-500">
                                    {quantityInCart} already in your cart; {remainingStock} available to add.
                                </p>
                            )}

                            <div className="mt-4 flex flex-col gap-3 border-t border-stone-100 pt-5 sm:flex-row">
                                <button
                                    onClick={handleWishlist}
                                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-accent hover:bg-amber-50 hover:text-brand sm:w-auto sm:px-6 sm:text-base"
                                >
                                    <Heart size={17} className={hasWishlist ? "fill-error text-error" : ""} aria-hidden="true" />
                                    {hasWishlist ? "Wishlisted" : "Wishlist"}
                                </button>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={quantity > remainingStock}
                                    className="min-h-11 w-full rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6 sm:text-base"
                                >
                                    {remainingStock === 0 ? "Stock in Cart" : "Add to Cart"}
                                </button>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
