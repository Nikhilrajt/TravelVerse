
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DollarSign, ShoppingBag } from "lucide-react";
import { fetchAllOrders } from "../../redux/slices/orderSlice";

function AdminDashboard() {
    const dispatch = useDispatch();

    const orders = useSelector((state) => state.order.orders);


    useEffect(() => {
        dispatch(fetchAllOrders());

        const interval = setInterval(() => {
            dispatch(fetchAllOrders());
        }, 5000);

        return () => clearInterval(interval);
    }, [dispatch]);


    const totalOrders = orders.length;

    const totalRevenue = orders.reduce((total, order) => {
        return total + Number(
            order.total ?? order.totalAmount ?? order.subtotal ?? 0
        );
    }, 0);

    const recentOrders = [...orders]
        .sort(
            (a, b) =>
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
        .slice(0, 5);

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="w-full">
            <main className="w-full space-y-8">

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Revenue
                                </p>

                                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                                    ₹{totalRevenue.toLocaleString("en-IN")}
                                </h2>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#3F2B96] flex items-center justify-center">
                                <DollarSign size={23} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Orders
                                </p>

                                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                                    {totalOrders}
                                </h2>
                            </div>

                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#3F2B96] flex items-center justify-center">
                                <ShoppingBag size={23} />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Recent Orders */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">
                            Recent Orders
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Latest customer orders from your store.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                        Customer
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                        Total
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            No orders available yet.
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                #{order.id}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {order.shipping?.name || "Customer"}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(order.createdAt)}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                ₹{Number(
                                                    order.total ?? order.totalAmount ?? order.subtotal ?? 0
                                                ).toLocaleString("en-IN")}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
}

export default AdminDashboard;
