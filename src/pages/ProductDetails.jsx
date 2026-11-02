import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addItem } from "../redux/slices/cartSlice";
import {
    addToWishlist,
    removeFromWishlist
} from "../redux/slices/wishlistSlice";

function ProductDetails() {
    const { id } = useParams();
    const products = useSelector((state) => state.product.products);
    const dispatch = useDispatch();

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [sizeError, setSizeError] = useState("");
    const [colorError, setColorError] = useState("");
    const [quantity, setQuantity] = useState(1);

    const navigate = useNavigate();
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const user = useSelector((state) => state.auth.user);

    const currentProduct = products.find((product) => {
        return product.id === id;
    });

    if (!currentProduct) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <h1 className="text-xl font-semibold text-stone-700 sm:text-2xl">
                    Product Not Found
                </h1>
            </div>
        );
    }

    const hasWishlist = wishlistItems.some(
        (item) => item.id === currentProduct.id
    );

    const handleAddToCart = () => {
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
        navigate("/cart");
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
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">

            <div className="grid gap-8 md:grid-cols-2 md:gap-10">

                {/* Product Image */}
                <div className="flex items-center justify-center rounded-2xl bg-stone-100 p-4 sm:p-8">
                    <img
                        src={currentProduct.image}
                        alt={currentProduct.name}
                        className="max-h-[400px] w-full rounded-xl object-contain sm:max-h-[500px]"
                    />
                </div>

                {/* Product Information */}
                <div className="flex flex-col justify-center">

                    <p className="mb-2 text-xs font-medium text-stone-500 sm:text-sm">
                        {currentProduct.category}
                    </p>

                    <h1 className="text-2xl font-bold leading-tight text-stone-900 sm:text-3xl md:text-4xl">
                        {currentProduct.name}
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-stone-600 sm:mt-4 sm:text-base sm:leading-7">
                        {currentProduct.description}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6 sm:gap-6">
                        <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">
                            ₹{currentProduct.price.toLocaleString("en-IN")}
                        </h2>

                        <div className="flex items-center gap-1 text-xs text-stone-600 sm:text-sm">
                            <span className="text-yellow-500">★</span>
                            {currentProduct.rating}
                            <span>
                                ({currentProduct.reviewCount} reviews)
                            </span>
                        </div>
                    </div>

                    <div className="mt-4">
                        {currentProduct.stock === 0 ? (
                            <span className="font-semibold text-red-600">
                                Out of Stock
                            </span>
                        ) : (
                            <span className="text-sm font-medium text-green-600">
                                {currentProduct.stock} items available
                            </span>
                        )}
                    </div>

                    <div className="my-5 border-t border-stone-200 sm:my-6" />

                    {/* Size */}
                    {currentProduct.sizes.length > 0 && (
                        <div>
                            <h2 className="mb-3 text-sm font-semibold text-stone-900 sm:text-base">
                                Size
                            </h2>

                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {currentProduct.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => {
                                            setSelectedSize(size);
                                            setSizeError("");
                                        }}
                                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition sm:px-5 ${
                                            selectedSize === size
                                                ? "border-stone-900 bg-stone-900 text-white"
                                                : "border-stone-300 bg-white text-stone-700 hover:border-stone-900"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}

                                {sizeError && (
                                    <p className="w-full text-sm text-red-600">
                                        {sizeError}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Color */}
                    {currentProduct.colors.length > 0 && (
                        <div className="mt-5 sm:mt-6">
                            <h2 className="mb-3 text-sm font-semibold text-stone-900 sm:text-base">
                                Color
                            </h2>

                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {currentProduct.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => {
                                            setSelectedColor(color);
                                            setColorError("");
                                        }}
                                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition sm:px-5 ${
                                            selectedColor === color
                                                ? "border-stone-900 bg-stone-900 text-white"
                                                : "border-stone-300 bg-white text-stone-700 hover:border-stone-900"
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}

                                {colorError && (
                                    <p className="w-full text-sm text-red-600">
                                        {colorError}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Quantity and Actions */}
                    {currentProduct.stock === 0 ? (
                        <div className="mt-6 rounded-lg bg-red-50 p-4 sm:mt-8">
                            <p className="font-semibold text-red-600">
                                This product is currently unavailable.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 sm:mt-8">

                            <h2 className="mb-3 text-sm font-semibold text-stone-900 sm:text-base">
                                Quantity
                            </h2>

                            <div className="flex w-fit items-center overflow-hidden rounded-lg border border-stone-300">
                                <button
                                    onClick={() =>
                                        setQuantity((prev) => prev - 1)
                                    }
                                    disabled={quantity <= 1}
                                    className="px-3 py-2 text-lg hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
                                >
                                    −
                                </button>

                                <span className="min-w-10 border-x border-stone-300 px-3 py-2 text-center font-medium sm:min-w-12 sm:px-4">
                                    {quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        setQuantity((prev) => prev + 1)
                                    }
                                    disabled={
                                        quantity >= currentProduct.stock
                                    }
                                    className="px-3 py-2 text-lg hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
                                >
                                    +
                                </button>
                            </div>

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={handleWishlist}
                                    className="w-full rounded-lg border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 sm:w-auto sm:px-6 sm:text-base"
                                >
                                    {hasWishlist
                                        ? "♥ Wishlisted"
                                        : "♡ Wishlist"}
                                </button>

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 sm:w-auto sm:px-6 sm:text-base"
                                >
                                    Add to Cart
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