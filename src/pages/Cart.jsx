import { useDispatch, useSelector } from "react-redux";
import { updateQuantity, removeItem } from "../redux/slices/cartSlice";

function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const totalItems = useSelector((state) => state.cart.totalItems);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => {
            const product = products.find(
              (product) => product.id === item.productId
            );
            return (
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
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium text-gray-700">
                      Quantity
                    </p>

                    <div className="flex w-fit items-center overflow-hidden rounded-lg border border-gray-300">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.productId,
                              size: item.size,
                              color: item.color,
                              quantity: item.quantity - 1
                            })
                          )
                        }
                        disabled={item.quantity <= 1}
                        className="px-4 py-2 text-lg font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="min-w-12 border-x border-gray-300 px-4 py-2 text-center font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.productId,
                              size: item.size,
                              color: item.color,
                              quantity: item.quantity + 1
                            })
                          )
                        }
                        disabled={item.quantity >= product.stock}
                        className="px-4 py-2 text-lg font-medium transition hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
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
                  <button
                    onClick={() =>
                      dispatch(
                        removeItem({
                          productId: item.productId,
                          size: item.size,
                          color: item.color
                        })
                      )
                    }
                    className="mt-4 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-sm rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Cart Summary
              </h2>

              <div className="mt-4 flex justify-between text-gray-600">
                <span>Total Items</span>
               <span>{totalItems}</span>
              </div>

              <div className="mt-3 flex justify-between text-lg font-semibold text-gray-900">
                <span>Subtotal</span>
                <span>
                  ₹{cartItems.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )}
                </span>
              </div>

              <button
                className="mt-6 w-full rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;