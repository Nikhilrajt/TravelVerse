
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAdminProducts,
    fetchAdminUsers,
    fetchAdminOrders
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

function AdminDashboard() {
    const dispatch = useDispatch();

    const { products, users, orders, loading } = useSelector(
        (state) => state.adminData
    );

    useEffect(() => {
        dispatch(fetchAdminProducts());
        dispatch(fetchAdminUsers());
        dispatch(fetchAdminOrders());
    }, [dispatch]);

    const stats = [
        { title: "Total Products", value: products.length, icon: "📦" },
        { title: "Total Users", value: users.length, icon: "👥" },
        { title: "Total Orders", value: orders.length, icon: "🛍️" },
        {
            title: "Revenue",
            value: `₹${orders
                .reduce((sum, order) => sum + getOrderTotal(order), 0)
                .toLocaleString("en-IN")}`,
            icon: "₹"
        }
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard
                </h1>
                <p className="text-gray-500 mt-2">
                    Welcome to your TravelVerse administration panel.
                </p>
            </div>

            {loading && (
                <p className="text-sm text-gray-500 mb-4">Loading data...</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-white p-6 rounded-xl border border-gray-200"
                    >
                        <div className="flex justify-between items-center">
                            <p className="text-gray-500 text-sm">
                                {stat.title}
                            </p>
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <h2 className="text-2xl font-bold mt-4 text-gray-900">
                            {stat.value}
                        </h2>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border mt-8 p-6">
                <h2 className="font-bold text-lg mb-5">Recent Orders</h2>

                {orders.length === 0 ? (
                    <p className="text-gray-500 text-sm">No orders found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="p-3">Order ID</th>
                                    <th className="p-3">Customer ID</th>
                                    <th className="p-3">Amount</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 5).map((order) => (
                                    <tr key={order.id} className="border-t">
                                        <td className="p-3">#{order.id}</td>
                                        <td className="p-3">{order.userId}</td>
                                        <td className="p-3">
                                            ₹{getOrderTotal(order).toLocaleString("en-IN")}
                                        </td>
                                        <td className="p-3">{normalizeStatus(order.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
