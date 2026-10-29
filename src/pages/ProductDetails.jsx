import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useState } from "react";

function ProductDetails() {
    const { id } = useParams();
    const products = useSelector((state) => state.product.products);

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);

    const currentProduct = products.find((product) => {
        return product.id === id;
    });

    if (!currentProduct) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <h1 className="text-2xl font-semibold text-gray-700">
                    Product Not Found
                </h1>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="grid gap-10 md:grid-cols-2">

                <div className="flex items-center justify-center rounded-2xl bg-gray-100 p-8">
                    <img
                        src={currentProduct.image}
                        alt={currentProduct.name}
                        className="max-h-[500px] w-full rounded-xl object-contain"
                    />
                </div>

                <div className="flex flex-col justify-center">

                    <p className="mb-2 text-sm font-medium text-gray-500">
                        {currentProduct.category}
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        {currentProduct.name}
                    </h1>

                    <p className="mt-4 leading-7 text-gray-600">
                        {currentProduct.description}
                    </p>

                    <div className="mt-6 flex items-center gap-6">
                        <h2 className="text-3xl font-bold text-gray-900">
                            ₹{currentProduct.price}
                        </h2>

                        <div className="flex items-center gap-1 text-sm text-gray-600">
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
                            <span className="font-medium text-green-600">
                                {currentProduct.stock} items available
                            </span>
                        )}
                    </div>

                    <div className="my-6 border-t border-gray-200" />

                    {currentProduct.sizes.length > 0 && (
                        <div>
                            <h2 className="mb-3 font-semibold text-gray-900">
                                Size
                            </h2>

                            <div className="flex flex-wrap gap-3">
                                {currentProduct.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`rounded-lg border px-5 py-2 text-sm font-medium transition ${
                                            selectedSize === size
                                                ? "border-gray-900 bg-gray-900 text-white"
                                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentProduct.colors.length > 0 && (
                        <div className="mt-6">
                            <h2 className="mb-3 font-semibold text-gray-900">
                                Color
                            </h2>

                            <div className="flex flex-wrap gap-3">
                                {currentProduct.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`rounded-lg border px-5 py-2 text-sm font-medium transition ${
                                            selectedColor === color
                                                ? "border-gray-900 bg-gray-900 text-white"
                                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentProduct.stock === 0 ? (
                        <div className="mt-8 rounded-lg bg-red-50 p-4">
                            <p className="font-semibold text-red-600">
                                This product is currently unavailable.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6">
                            <h2 className="mb-3 font-semibold text-gray-900">
                                Quantity
                            </h2>

                            <div className="flex w-fit items-center overflow-hidden rounded-lg border border-gray-300">
                                <button
                                    onClick={() =>
                                        setQuantity((prev) => prev - 1)
                                    }
                                    disabled={quantity <= 1}
                                    className="px-4 py-2 text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    −
                                </button>

                                <span className="min-w-12 border-x border-gray-300 px-4 py-2 text-center font-medium">
                                    {quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        setQuantity((prev) => prev + 1)
                                    }
                                    disabled={
                                        quantity >= currentProduct.stock
                                    }
                                    className="px-4 py-2 text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    +
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