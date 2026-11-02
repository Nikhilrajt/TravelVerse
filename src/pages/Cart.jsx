import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateQuantity, removeItem } from "../redux/slices/cartSlice";

function Cart() {
  const cartItems = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.product.products);
  const totalItems = useSelector((state) => state.cart.totalItems);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">

      <h1 className="mb-6 text-2xl font-bold text-stone-900 sm:mb-8 sm:text-3xl">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="mt-8 flex flex-col items-center px-4 text-center">
          <p className="text-sm text-stone-600 sm:text-base">
            Your cart is empty.
          </p>

          <Link
            to="/productlist"
            className="mt-5 rounded-lg bg-stone-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-stone-800 sm:text-base"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">

          {cartItems.map((item) => {
            const product = products.find(
              (product) =>
                String(product.id) === String(item.productId)
            );

            const canIncreaseQuantity =
              Number.isFinite(product?.stock) &&
              item.quantity < product.stock;

            return (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex flex-col gap-4 rounded-xl border border-stone-200 p-4 sm:flex-row sm:gap-6 sm:p-5"
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-48 w-full rounded-lg object-contain sm:h-32 sm:w-32"
                />

                <div className="flex-1">

                  <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
                    {item.name}
                  </h2>

                  <p className="mt-2 text-base font-semibold text-stone-900 sm:text-lg">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>

                  {(item.size || item.color) && (
                    <div className="mt-2 space-y-1 text-sm text-stone-600">
                      {item.size && (
                        <p>
                          Size: {item.size}
                        </p>
                      )}

                      {item.color && (
                        <p>
                          Color: {item.color}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4">

                    <p className="mb-2 text-sm font-medium text-stone-700">
                      Quantity
                    </p>

                    <div className="flex w-fit items-center overflow-hidden rounded-lg border border-stone-300">

                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.productId,
                              size: item.size,
                              color: item.color,
                              quantity: item.quantity - 1,
                              userId: user.id
                            })
                          )
                        }
                        disabled={item.quantity <= 1}
                        className="px-3 py-2 text-lg font-medium transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
                      >
                        −
                      </button>

                      <span className="min-w-10 border-x border-stone-300 px-3 py-2 text-center text-sm font-medium sm:min-w-12 sm:px-4 sm:text-base">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.productId,
                              userId: user.id,
                              size: item.size,
                              color: item.color,
                              quantity: item.quantity + 1
                            })
                          )
                        }
                        disabled={!canIncreaseQuantity}
                        className="px-3 py-2 text-lg font-medium transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
                      >
                        +
                      </button>

                    </div>
                  </div>

                  <button
                    onClick={() =>
                      dispatch(
                        removeItem({
                          ...item,
                          userId: user.id
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

          <div className="mt-8 flex justify-stretch sm:justify-end">

            <div className="w-full max-w-sm rounded-xl border border-stone-200 p-5 sm:p-6">

              <h2 className="text-lg font-semibold text-stone-900 sm:text-xl">
                Cart Summary
              </h2>

              <div className="mt-4 flex justify-between text-sm text-stone-600 sm:text-base">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="mt-3 flex justify-between text-base font-semibold text-stone-900 sm:text-lg">
                <span>Subtotal</span>
                <span>
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <Link
                to="/checkout"
                className="mt-6 block w-full rounded-lg bg-stone-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-stone-800 sm:text-base"
              >
                Checkout
              </Link>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;