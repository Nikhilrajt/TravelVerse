import { useSelector } from "react-redux";

function Cart() {
    const cartItems = useSelector((state) => state.cart.items);

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <h1 className="mb-8 text-3xl font-bold text-gray-900">
                Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
                <p className="text-gray-600">Your cart is empty.</p>
            ) : (
                <div className="space-y-6">
                    {cartItems.map((item) => (
                        <div
                            key={`${item.productId}-${item.size}-${item.color}`}
                            className="flex gap-6 rounded-xl border border-gray-200 p-5"
                        >
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-32 w-32 rounded-lg object-contain"
                            />

                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {item.name}
                                </h2>

                                <p className="mt-2 text-lg font-semibold">
                                    ₹{item.price}
                                </p>

                                <p className="mt-2 text-gray-600">
                                    Quantity: {item.quantity}
                                </p>

                                {item.size && (
                                    <p className="text-gray-600">
                                        Size: {item.size}
                                    </p>
                                )}

                                {item.color && (
                                    <p className="text-gray-600">
                                        Color: {item.color}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Cart;