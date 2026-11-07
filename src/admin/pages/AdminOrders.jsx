
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAdminOrders,
    updateOrderStatus
} from "../adminRedux/slices/adminDataSlice";

const orderStatusOptions = [
    "Placed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
];

const normalizeStatus = (status) => {
    const value = String(status || "Placed");
    const match = orderStatusOptions.find(
        (option) => option.toLowerCase() === value.toLowerCase()
    );

    return match || "Placed";
};

const getOrderTotal = (order) => {
    const rawTotal = Number(order?.totalAmount ?? order?.total ?? 0);
    return Number.isFinite(rawTotal) ? rawTotal : 0;
};

function AdminOrders() {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector(
        (state) => state.adminData
    );

    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        dispatch(fetchAdminOrders());
    }, [dispatch]);

    async function handleStatusChange(id, status) {
        try {
            await dispatch(
                updateOrderStatus({ id, status })
            ).unwrap();

            setSelectedOrder((prev) =>
                prev && String(prev.id) === String(id)
                    ? { ...prev, status }
                    : prev
            );
        } catch (err) {
            alert(err);
        }
    }

    return (
        <div>
            <div className="mb-7">
                <h1 className="text-3xl font-bold">Orders</h1>
                <p className="text-gray-500 mt-2">
                    View and manage customer orders.
                </p>
            </div>

            {loading && <p className="text-gray-500 mb-3">Loading orders...</p>}
            {error && <p className="text-red-500 mb-3">{error}</p>}

            <div className="bg-white rounded-xl border overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-4">Order</th>
                            <th className="p-4">Customer ID</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Details</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => {
                            const displayStatus = normalizeStatus(order.status);
                            const orderTotal = getOrderTotal(order);

                            return (
                                <tr key={order.id} className="border-t">
                                    <td className="p-4">#{order.id}</td>
                                    <td className="p-4">{order.userId}</td>
                                    <td className="p-4">
                                        {order.createdAt
                                            ? new Date(order.createdAt).toLocaleDateString()
                                            : "—"}
                                    </td>
                                    <td className="p-4">
                                        ₹{orderTotal.toLocaleString("en-IN")}
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={displayStatus}
                                            onChange={(e) =>
                                                handleStatusChange(order.id, e.target.value)
                                            }
                                            className="border rounded-lg p-2 bg-white"
                                        >
                                            {orderStatusOptions.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-bold">
                                Order #{selectedOrder.id}
                            </h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-500 text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                            Customer ID: {selectedOrder.userId}
                        </p>

                        <h3 className="font-semibold mb-3">Order items</h3>

                        <div className="space-y-3">
                            {(selectedOrder.items || []).map((item, index) => (
                                <div key={`${item.productId}-${index}`} className="border-b pb-3">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                        Quantity: {item.quantity} | Size: {item.size || "—"} |
                                        Color: {item.color || "—"}
                                    </p>
                                    <p className="text-sm mt-1">
                                        ₹{Number(item.price).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <p className="font-bold mt-5 text-right">
                            Total: ₹{getOrderTotal(selectedOrder).toLocaleString("en-IN")}
                        </p>

                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="mt-5 w-full bg-gray-900 text-white py-3 rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrders;
