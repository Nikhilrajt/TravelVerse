import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateQuantity, removeItem, clearCart } from "../redux/slices/cartSlice";

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
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">

      <div className="mb-7 flex flex-col gap-4 border-b border-stone-300 pb-6 sm:mb-9 sm:flex-row sm:items-end sm:justify-between sm:pb-7">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brand">Your selection</p>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Review your travel essentials before checkout.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-fit border-l-2 border-accent bg-white px-4 py-3 text-sm font-semibold text-brand shadow-sm">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={() => dispatch(clearCart(user.id))}
              className="min-h-11 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-lg border border-stone-200 bg-white px-4 py-10 text-center shadow-sm">
          <p className="text-sm text-stone-600 sm:text-base">
            Your cart is empty.
          </p>

          <Link
            to="/productlist"
            className="mt-5 min-h-11 rounded-md bg-brand px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-hover sm:text-base"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8">

          <div className="space-y-4">
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
                  className="flex flex-col gap-4 rounded-lg border border-stone-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:gap-6 sm:p-6"
                >

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-44 w-full rounded-md bg-surface-muted object-contain p-4 sm:h-36 sm:w-36"
                />

                <div className="flex-1">

                  <h2 className="font-serif text-xl font-semibold text-stone-900 sm:text-2xl">
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
                        className="min-h-11 min-w-11 text-lg font-medium transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-12"
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
                        className="min-h-11 min-w-11 text-lg font-medium transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-12"
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
                    className="mt-4 min-h-11 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>

                </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-stretch sm:justify-end lg:sticky lg:top-6">

            <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-7">

              <h2 className="font-serif text-xl font-semibold text-stone-900 sm:text-2xl">
                Cart Summary
              </h2>

              <div className="mt-4 flex justify-between text-sm text-stone-600 sm:text-base">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="mt-3 flex justify-between border-t border-stone-100 pt-4 text-base font-semibold text-stone-900 sm:text-lg">
                <span>Subtotal</span>
                <span>
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <Link
                to="/checkout"
                className="mt-6 block min-h-11 w-full rounded-md bg-brand px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-hover sm:text-base"
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
