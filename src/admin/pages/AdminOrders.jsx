
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../redux/slices/orderSlice";

function AdminOrders() {
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { orders, loading, error } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      order.id?.toLowerCase().includes(search) ||
      order.shipping?.name?.toLowerCase().includes(search) ||
      order.shipping?.email?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="w-full space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-brand">
            Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and review customer orders.
          </p>
        </div>

        <span className="text-sm font-medium text-gray-600">
          {orders.length} Total Orders
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative w-full max-w-lg">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <path
                d="m16 16 4 4"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="min-h-11 w-full rounded-md border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>

        <p className="text-sm text-gray-500 self-center">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      </div>

      {loading && (
        <p className="text-gray-500">Loading orders...</p>
      )}

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && !error && filteredOrders.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-gray-700 font-medium">
            {searchTerm
              ? "No matching orders found."
              : "No orders found."}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {searchTerm
              ? "Try searching with a different keyword."
              : "Orders will appear here when customers place them."}
          </p>
        </div>
      )}

      {!loading && !error && filteredOrders.length > 0 && (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Order ID
                  </p>
                  <h2 className="font-semibold text-gray-900">
                    #{order.id}
                  </h2>
                </div>

                <span className="w-fit rounded-full bg-warning-surface px-3 py-1 text-xs font-semibold capitalize text-warning">
                  {order.status || "Placed"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Customer
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {order.shipping?.name ||
                      "Customer details unavailable"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.shipping?.email || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Order Date
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Total Amount
                  </p>
                  <p className="font-serif text-lg font-semibold text-brand">
                    ₹{order.total ?? order.totalAmount}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-800 mb-3">
                  Ordered Products ({order.items?.length || 0})
                </p>

                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start gap-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                        {item.size && ` | Size: ${item.size}`}
                        {item.color && ` | Color: ${item.color}`}
                      </p>
                    </div>

                    <p className="font-medium text-gray-700 whitespace-nowrap">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end border-t border-gray-100 pt-4 mt-2">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="min-h-11 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-hover"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      
{selectedOrder && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 backdrop-blur-sm sm:p-4">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">

      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
        <div>
          <h2 className="font-serif text-xl font-semibold text-brand">
            Order Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Order #{selectedOrder.id}
          </p>
        </div>

        <button
          onClick={() => setSelectedOrder(null)}
          className="flex h-11 w-11 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-red-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6 p-4 sm:p-6">

        <section>
          <h3 className="mb-3 font-serif font-semibold text-brand">
            Order Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">
                Order ID
              </p>
              <p className="text-sm font-medium text-gray-800 break-all">
                #{selectedOrder.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">
                Order Date
              </p>
              <p className="text-sm font-medium text-gray-800">
                {selectedOrder.createdAt
                  ? new Date(selectedOrder.createdAt).toLocaleString()
                  : "Not available"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">
                Order Status
              </p>
              <span className="inline-block rounded-full bg-warning-surface px-3 py-1 text-xs font-semibold capitalize text-warning">
                {selectedOrder.status || "Placed"}
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">
                Total Items
              </p>
              <p className="text-sm font-medium text-gray-800">
                {selectedOrder.items?.reduce(
                  (total, item) => total + Number(item.quantity || 0),
                  0
                ) || 0} items
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 font-serif font-semibold text-brand">
            Customer Information
          </h3>

          <div className="border border-gray-200 rounded-xl p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Full Name</p>
              <p className="text-sm font-medium text-gray-800">
                {selectedOrder.shipping?.name || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Email Address</p>
              <p className="text-sm text-gray-800 break-all">
                {selectedOrder.shipping?.email || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Phone Number</p>
              <p className="text-sm text-gray-800">
                {selectedOrder.shipping?.phone || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
              <p className="text-sm text-gray-800">
                {selectedOrder.shipping?.address || "Not available"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">City</p>
                <p className="text-sm text-gray-800">
                  {selectedOrder.shipping?.city || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Pincode</p>
                <p className="text-sm text-gray-800">
                  {selectedOrder.shipping?.pincode || "Not available"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 font-serif font-semibold text-brand">
            Ordered Products
          </h3>

          <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
            {selectedOrder.items?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start gap-4 p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.name}
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    Quantity: {item.quantity}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Size: {item.size || "N/A"}
                    {" | "}
                    Color: {item.color || "N/A"}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Unit Price: ₹{item.price}
                  </p>
                </div>

                <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 rounded-xl p-5">
          <h3 className="mb-4 font-serif font-semibold text-brand">
            Order Summary
          </h3>

          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span>Subtotal</span>
            <span>
              ₹{selectedOrder.subtotal ?? selectedOrder.total ?? selectedOrder.totalAmount}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span>Shipping</span>
            <span>₹0</span>
          </div>

          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
            <span className="font-semibold text-gray-900">
              Total Amount
            </span>
            <span className="font-serif text-xl font-semibold text-brand">
              ₹{selectedOrder.total ?? selectedOrder.totalAmount}
            </span>
          </div>
        </section>

      </div>

      <div className="flex justify-end border-t border-gray-100 px-4 py-4 sm:px-6">
        <button
          onClick={() => setSelectedOrder(null)}
          className="min-h-11 w-full rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-hover sm:w-auto"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  );
}

export default AdminOrders;
