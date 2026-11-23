
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";
import { fetchAllOrders } from "../../redux/slices/orderSlice";
import { fetchProducts } from "../../redux/slices/productSlice";
import { fetchAdminUsers } from "../adminRedux/slices/adminUserSlice";

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);
}

function AdminDashboard() {
    const dispatch = useDispatch();

    const orders = useSelector((state) => state.order.orders);
    const users = useSelector((state) => state.adminUser.users);
    const products = useSelector((state) => state.product.products);

    useEffect(() => {
        const refreshDashboard = () => {
            dispatch(fetchAllOrders());
            dispatch(fetchProducts());
            dispatch(fetchAdminUsers());
        };

        refreshDashboard();
        const interval = setInterval(refreshDashboard, 5000);

        return () => clearInterval(interval);
    }, [dispatch]);


    const totalOrders = orders.length;
    const totalItemsSold = orders.reduce(
        (total, order) => total + (order.items ?? []).reduce(
            (itemTotal, item) => itemTotal + Number(item.quantity || 0),
            0
        ),
        0
    );

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

    const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - (6 - index));
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        const dayOrders = orders.filter((order) => {
            if (!order.createdAt) return false;
            const orderDate = new Date(order.createdAt);
            return `${orderDate.getFullYear()}-${orderDate.getMonth()}-${orderDate.getDate()}` === key;
        });

        return {
            label: date.toLocaleDateString("en-IN", { weekday: "short" }),
            revenue: dayOrders.reduce((total, order) => total + Number(
                order.total ?? order.totalAmount ?? order.subtotal ?? 0
            ), 0),
            count: dayOrders.length
        };
    });
    const maxDailyRevenue = Math.max(...lastSevenDays.map((day) => day.revenue), 0);
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                    <div className="flex min-h-28 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <h2 className="mt-2 truncate font-serif text-2xl font-semibold text-brand">{formatCurrency(totalRevenue)}</h2>
                        </div>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-amber-50 text-brand"><DollarSign size={21} aria-hidden="true" /></span>
                    </div>
                    <div className="flex min-h-28 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                        <div><p className="text-sm font-medium text-gray-500">Total Orders</p><h2 className="mt-2 font-serif text-2xl font-semibold text-brand">{totalOrders}</h2></div>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-amber-50 text-brand"><ShoppingBag size={21} aria-hidden="true" /></span>
                    </div>
                    <div className="flex min-h-28 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                        <div><p className="text-sm font-medium text-gray-500">Registered Users</p><h2 className="mt-2 font-serif text-2xl font-semibold text-brand">{users.length}</h2></div>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-800"><Users size={21} aria-hidden="true" /></span>
                    </div>
                    <div className="flex min-h-28 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                        <div><p className="text-sm font-medium text-gray-500">Products Listed</p><h2 className="mt-2 font-serif text-2xl font-semibold text-brand">{products.length}</h2></div>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-amber-50 text-brand"><Package size={21} aria-hidden="true" /></span>
                    </div>
                    <div className="flex min-h-28 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                        <div><p className="text-sm font-medium text-gray-500">Items Sold</p><h2 className="mt-2 font-serif text-2xl font-semibold text-brand">{totalItemsSold}</h2></div>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-amber-50 text-accent"><ShoppingBag size={21} aria-hidden="true" /></span>
                    </div>
                </div>

                <div>
                    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="revenue-chart-heading">
                        <div className="flex flex-wrap items-end justify-between gap-2">
                            <div>
                                <h2 id="revenue-chart-heading" className="font-serif text-lg font-semibold text-brand">Revenue trend</h2>
                                <p className="mt-1 text-sm text-gray-500">Daily revenue over the last 7 days</p>
                            </div>
                            <p className="text-xs text-gray-400">{formatCurrency(lastSevenDays.reduce((sum, day) => sum + day.revenue, 0))} total</p>
                        </div>
                        <div role="img" aria-label={`Revenue chart for the last seven days. Total ${formatCurrency(lastSevenDays.reduce((sum, day) => sum + day.revenue, 0))}.`} className="mt-6 grid h-48 grid-cols-7 items-end gap-2 border-b border-gray-100 px-1 sm:gap-4">
                            {lastSevenDays.map((day, index) => (
                                <div key={`${day.label}-${index}`} className="flex h-full min-w-0 flex-col items-center justify-end gap-2">
                                    {day.revenue > 0 ? (
                                        <span className="truncate text-[10px] text-gray-500 sm:text-xs" title={`${formatCurrency(day.revenue)} · ${day.count} orders`}>
                                            {formatCurrency(day.revenue)}
                                        </span>
                                    ) : <span aria-hidden="true" className="h-[18px]" />}
                                    <div className="flex h-32 w-full items-end justify-center border-b border-gray-200">
                                        <div className="w-1/2 max-w-16 rounded-t-md bg-info transition-[height] duration-500" style={{ height: `${day.revenue > 0 && maxDailyRevenue ? Math.max(4, (day.revenue / maxDailyRevenue) * 100) : 0}%` }} />
                                    </div>
                                    <span className="pb-2 text-[10px] font-medium text-gray-500 sm:text-xs">{day.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">

                    <div className="p-6 border-b border-gray-100">
                        <h2 className="font-serif text-lg font-semibold text-brand">
                            Recent Orders
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Latest customer orders from your store.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left">
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
                                                {formatCurrency(Number(
                                                    order.total ?? order.totalAmount ?? order.subtotal ?? 0
                                                ))}
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
