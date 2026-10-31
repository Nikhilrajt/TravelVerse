import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getOrdersByUser } from "../services/orderService";

function Orders() {
  const user = useSelector((state) => state.auth.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadOrders() {
      if (!user?.id) {
        setOrders([]);
        setError("Your account information could not be found. Please sign in again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const userOrders = await getOrdersByUser(user.id);
        if (isCurrent) {
          setOrders(
            [...userOrders].sort(
              (firstOrder, secondOrder) =>
                new Date(secondOrder.createdAt) - new Date(firstOrder.createdAt)
            )
          );
        }
      } catch (requestError) {
        if (isCurrent) {
          setError(
            requestError?.response?.data?.message ||
              requestError?.message ||
              "Failed to load your orders."
          );
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      isCurrent = false;
    };
  }, [user?.id]);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">Your Orders</h1>

        {loading ? (
          <p className="text-slate-600">Loading your orders...</p>
        ) : error ? (
          <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-slate-800">
              No orders yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Your placed orders will appear here.
            </p>
            <Link
              to="/productlist"
              className="mt-5 inline-block rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Order #{order.id}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                    {order.status}
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {(order.items ?? []).map((item) => (
                    <div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-lg bg-slate-50 object-contain p-1"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Qty: {item.quantity}
                            {item.size ? ` · ${item.size}` : ""}
                            {item.color ? ` · ${item.color}` : ""}
                          </p>
                        </div>
                      </div>
                      <p className="whitespace-nowrap text-sm font-semibold text-slate-900">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-sm">
                  <span className="text-slate-500">
                    {order.shipping?.name
                      ? `Ship to ${order.shipping.name}`
                      : "Shipping details unavailable"}
                  </span>
                  <span className="font-bold text-slate-900">
                    Total: ₹{order.total ?? order.totalAmount ?? 0}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Orders;
