import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeItem } from "../redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { createOrder } from "../services/orderService";
import { addOrder } from "../redux/slices/orderSlice";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const [shipping, setShipping] = useState({
    name: user?.fullName ?? "",
    email: user?.email ?? "",
    address: "",
    city: "",
    pincode: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  function handleShippingChange(event) {
    const { name, value } = event.target;
    setShipping((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (Object.values(shipping).some((value) => !value.trim())) {
      setError("Please complete all shipping fields.");
      return;
    }

    if (!user?.id) {
      setError("Your account information could not be found. Please sign in again.");
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

      cart.forEach(({ productId, size, color }) => {
        dispatch(removeItem({ productId, size, color }));
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
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="mt-1 text-sm text-slate-500">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/productlist"
          className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Checkout
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8 lg:col-span-7">
            <h2 className="mb-6 text-lg font-bold text-slate-800">
              Shipping Information
            </h2>

            {error && (
              <p
                role="alert"
                className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600"
              >
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="shipping-name"
                  className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition focus:border-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="shipping-email"
                  className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition focus:border-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="shipping-address"
                  className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition focus:border-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="shipping-city"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500"
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition focus:border-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="shipping-pincode"
                    className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500"
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition focus:border-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="shipping-phone"
                  className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition focus:border-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8 lg:col-span-5">
            <h2 className="mb-6 text-lg font-bold text-slate-800">
              Order Summary
            </h2>

            <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {item.image && (
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-1">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-xs font-semibold text-slate-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Qty: {item.quantity}
                        {item.size ? ` · ${item.size}` : ""}
                        {item.color ? ` · ${item.color}` : ""}
                      </p>
                    </div>
                  </div>
                  <p className="flex-shrink-0 text-sm font-bold text-slate-900">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Items ({totalItems})</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span>₹{subtotal}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
