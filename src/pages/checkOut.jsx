import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeItem } from "../redux/slices/cartSlice";
import { createOrder, updateProductStock } from "../services/orderService";
import { getProductById } from "../services/productServices";
import { productStockUpdated } from "../redux/slices/productSlice";
import { addOrder } from "../redux/slices/orderSlice";
import { updateUserAddress } from "../services/authService";
import { updateUser } from "../redux/slices/authSlice";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

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
  const submittingRef = useRef(false);

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
    if (submittingRef.current) return;
    setError("");

    if (Object.values(shipping).some((value) => !value.trim())) {
      setError("Please complete all shipping fields.");
      return;
    }

    if (!user?.id) {
      setError(
        "Your account information could not be found. Please sign in again."
      );
      return;
    }

    submittingRef.current = true;
    try {
      setLoading(true);

      const quantitiesByProduct = new Map();
      for (const item of cart) {
        const key = String(item.productId);
        const requested = quantitiesByProduct.get(key) ?? {
          productId: item.productId,
          name: item.name,
          quantity: 0
        };
        requested.quantity += Number(item.quantity);
        quantitiesByProduct.set(key, requested);
      }

      const stockChanges = [];
      let createdOrder;
      try {
        for (const requested of quantitiesByProduct.values()) {
          if (!Number.isFinite(requested.quantity) || requested.quantity <= 0) {
            throw new Error(`Invalid quantity for ${requested.name}.`);
          }

          const latestProduct = await getProductById(requested.productId);
          const available = Number(latestProduct.stock);

          if (!Number.isFinite(available) || requested.quantity > available) {
            throw new Error(
              `Insufficient stock for ${latestProduct.name ?? requested.name}. Available: ${Number.isFinite(available) ? available : 0}.`
            );
          }

          const updatedProduct = await updateProductStock(
            latestProduct.id,
            available - requested.quantity
          );
          stockChanges.push(latestProduct);
          dispatch(productStockUpdated(updatedProduct));
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
        createdOrder = await createOrder(orderData);
      } catch (checkoutError) {
        // JSON Server has no transactions. Restore any completed patches if a
        // later stock update or order request fails; rollback is best effort.
        for (const product of [...stockChanges].reverse()) {
          try {
            const restoredProduct = await updateProductStock(
              product.id,
              product.stock
            );
            dispatch(productStockUpdated(restoredProduct));
          } catch {
            // Continue attempting to restore the remaining products.
          }
        }
        throw checkoutError;
      }

      dispatch(addOrder(createdOrder));

      try {
        const updatedUser = await updateUserAddress(user.id, {
          address: shipping.address.trim(),
          city: shipping.city.trim(),
          pincode: shipping.pincode.trim(),
          phone: shipping.phone.trim()
        });
        dispatch(updateUser(updatedUser));
      } catch (addressError) {
        console.error("Could not save the updated shipping address:", addressError);
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
      submittingRef.current = false;
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center rounded-lg border border-stone-200 bg-white px-6 text-center shadow-sm sm:p-8">
      <h2 className="font-serif text-xl font-semibold text-stone-800">
          Your cart is empty
        </h2>

        <p className="mt-1 max-w-sm text-sm text-stone-500">
          Add items to your cart before proceeding to checkout.
        </p>

        <Link
          to="/productlist"
          className="mt-5 min-h-11 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-7 sm:px-6 sm:py-10 lg:px-8">

      <div className="mx-auto max-w-6xl">

        <div className="mb-7 rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:mb-9 sm:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Almost there
          </p>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Confirm your delivery details and review your order.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start lg:gap-8">

          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-8 lg:col-span-7">

            <h2 className="mb-5 font-serif text-lg font-semibold text-stone-800 sm:mb-6">
              Shipping Information
            </h2>

            {error && (
              <p
                role="alert"
                className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600 sm:mb-6"
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
                  className="min-h-11 w-full rounded-md border border-stone-200 bg-canvas px-3 py-3 text-sm text-stone-800 transition focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 sm:px-4"
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
                  className="min-h-11 w-full rounded-md border border-stone-200 bg-canvas px-3 py-3 text-sm text-stone-800 transition focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 sm:px-4"
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
                  className="w-full resize-none rounded-md border border-stone-200 bg-canvas px-3 py-3 text-sm text-stone-800 transition focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 sm:px-4"
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
                    className="min-h-11 w-full rounded-md border border-stone-200 bg-canvas px-3 py-3 text-sm text-stone-800 transition focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 sm:px-4"
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
                    className="min-h-11 w-full rounded-md border border-stone-200 bg-canvas px-3 py-3 text-sm text-stone-800 transition focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 sm:px-4"
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
                  className="min-h-11 w-full rounded-md border border-stone-200 bg-canvas px-3 py-3 text-sm text-stone-800 transition focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 sm:px-4"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-5 min-h-11 w-full rounded-md bg-brand py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:mt-6"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

            </form>
          </section>

          <section className="h-fit rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-8 lg:sticky lg:top-6 lg:col-span-5">

            <h2 className="mb-5 font-serif text-lg font-semibold text-stone-800 sm:mb-6">
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
                      <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-md border border-stone-100 bg-stone-50 p-1 sm:h-12 sm:w-12">
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
                <span className="font-semibold text-success">
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
