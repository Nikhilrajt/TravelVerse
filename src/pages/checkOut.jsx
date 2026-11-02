import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeItem } from "../redux/slices/cartSlice";
import { createOrder, updateProductStock } from "../services/orderService";
import { addOrder } from "../redux/slices/orderSlice";
import { updateUserAddress } from "../services/authService";
import { updateUser } from "../redux/slices/authSlice";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const products = useSelector((state) => state.product.products);

  const [shipping, setShipping] = useState({
    name: user?.fullName ?? "",
    email: user?.email ?? "",
    address: user?.address?.address ?? "",
    city: user?.address?.city ?? "",
    pincode: user?.address?.pincode ?? "",
    phone: user?.address?.phone ?? ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function handleShippingChange(event) {
    const { name, value } = event.target;

    setShipping((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (Object.values(shipping).some((value) => !value.trim())) {
      setError("Please complete all shipping fields.");
      return;
    }

    for (const item of cart) {
      const product = products.find(
        (product) => product.id === item.productId
      );

      if (!product || product.stock < item.quantity) {
        setError(`Insufficient stock for ${item.name}`);
        return;
      }
    }

    if (!user?.id) {
      setError(
        "Your account information could not be found. Please sign in again."
      );
      return;
    }

    const orderData = {
      userId: user.id,
      shipping: {
        ...shipping,
        name: shipping.name.trim(),
        email: shipping.email.trim(),
        address: shipping.address.trim(),
        city: shipping.city.trim(),
        pincode: shipping.pincode.trim(),
        phone: shipping.phone.trim()
      },
      items: cart,
      subtotal,
      total: subtotal,
      status: "placed",
      createdAt: new Date().toISOString()
    };

    try {
      setLoading(true);

      const createdOrder = await createOrder(orderData);
      dispatch(addOrder(createdOrder));

      const updatedUser = await updateUserAddress(user.id, {
        address: shipping.address.trim(),
        city: shipping.city.trim(),
        pincode: shipping.pincode.trim(),
        phone: shipping.phone.trim()
      });

      dispatch(updateUser(updatedUser));

      for (const item of cart) {
        const product = products.find(
          (product) => product.id === item.productId
        );

        await updateProductStock(
          product.id,
          product.stock - item.quantity
        );
      }

      cart.forEach(({ productId, size, color }) => {
        dispatch(
          removeItem({
            productId,
            size,
            color,
            userId: user.id
          })
        );
      });

      navigate("/orders");
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Failed to place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center sm:p-6">
        <h2 className="text-xl font-bold text-stone-800">
          Your cart is empty
        </h2>

        <p className="mt-1 max-w-sm text-sm text-stone-500">
          Add items to your cart before proceeding to checkout.
        </p>

        <Link
          to="/productlist"
          className="mt-5 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-stone-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

      <div className="mx-auto max-w-6xl">

        <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-stone-900 sm:mb-8 sm:text-3xl">
          Checkout
        </h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">

          {/* Shipping Information */}
          <section className="rounded-2xl border border-stone-100 bg-white p-4 shadow-xl shadow-stone-200/50 sm:rounded-3xl sm:p-8 lg:col-span-7">

            <h2 className="mb-5 text-lg font-bold text-stone-800 sm:mb-6">
              Shipping Information
            </h2>

            {error && (
              <p
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600 sm:mb-6"
              >
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label
                  htmlFor="shipping-name"
                  className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500"
                >
                  Full Name
                </label>

                <input
                  id="shipping-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={shipping.name}
                  onChange={handleShippingChange}
                  required
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-800 transition focus:border-stone-900 focus:bg-white focus:outline-none sm:px-4"
                />
              </div>

              <div>
                <label
                  htmlFor="shipping-email"
                  className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500"
                >
                  Email Address
                </label>

                <input
                  id="shipping-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={shipping.email}
                  onChange={handleShippingChange}
                  required
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-800 transition focus:border-stone-900 focus:bg-white focus:outline-none sm:px-4"
                />
              </div>

              <div>
                <label
                  htmlFor="shipping-address"
                  className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500"
                >
                  Address
                </label>

                <textarea
                  id="shipping-address"
                  name="address"
                  rows="3"
                  autoComplete="street-address"
                  value={shipping.address}
                  onChange={handleShippingChange}
                  required
                  className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-800 transition focus:border-stone-900 focus:bg-white focus:outline-none sm:px-4"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="shipping-city"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500"
                  >
                    City
                  </label>

                  <input
                    id="shipping-city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    value={shipping.city}
                    onChange={handleShippingChange}
                    required
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-800 transition focus:border-stone-900 focus:bg-white focus:outline-none sm:px-4"
                  />
                </div>

                <div>
                  <label
                    htmlFor="shipping-pincode"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500"
                  >
                    Pincode
                  </label>

                  <input
                    id="shipping-pincode"
                    name="pincode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={shipping.pincode}
                    onChange={handleShippingChange}
                    required
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-800 transition focus:border-stone-900 focus:bg-white focus:outline-none sm:px-4"
                  />
                </div>

              </div>

              <div>
                <label
                  htmlFor="shipping-phone"
                  className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-500"
                >
                  Phone Number
                </label>

                <input
                  id="shipping-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={shipping.phone}
                  onChange={handleShippingChange}
                  required
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm text-stone-800 transition focus:border-stone-900 focus:bg-white focus:outline-none sm:px-4"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full rounded-xl bg-stone-900 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:mt-6"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

            </form>
          </section>

          {/* Order Summary */}
          <section className="rounded-2xl border border-stone-100 bg-white p-4 shadow-xl shadow-stone-200/50 sm:rounded-3xl sm:p-8 lg:col-span-5">

            <h2 className="mb-5 text-lg font-bold text-stone-800 sm:mb-6">
              Order Summary
            </h2>

            <div className="max-h-80 divide-y divide-stone-100 overflow-y-auto pr-1 sm:pr-2">

              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex items-center justify-between gap-2 py-3 sm:gap-3"
                >

                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">

                    {item.image && (
                      <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-stone-100 bg-stone-50 p-1 sm:h-12 sm:w-12">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="line-clamp-2 text-xs font-semibold text-stone-800">
                        {item.name}
                      </p>

                      <p className="text-[11px] text-stone-400 sm:text-xs">
                        Qty: {item.quantity}
                        {item.size ? ` · ${item.size}` : ""}
                        {item.color ? ` · ${item.color}` : ""}
                      </p>
                    </div>

                  </div>

                  <p className="flex-shrink-0 text-xs font-bold text-stone-900 sm:text-sm">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>

                </div>
              ))}

            </div>

            <div className="mt-5 space-y-2 border-t border-stone-100 pt-4 sm:mt-6">

              <div className="flex justify-between text-xs text-stone-500 sm:text-sm">
                <span>Items ({totalItems})</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between text-xs text-stone-500 sm:text-sm">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600">
                  Free
                </span>
              </div>

              <div className="flex justify-between border-t border-stone-100 pt-3 text-base font-extrabold text-stone-900 sm:text-lg">
                <span>Total Amount</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

            </div>

          </section>
        </div>
      </div>
    </div>
  );
}

export default Checkout;