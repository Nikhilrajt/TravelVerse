import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchOrders } from "../redux/slices/orderSlice";

function Orders() {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);

    const {
        orders,
        loading,
        error
    } = useSelector((state) => state.order);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchOrders(user.id));
        }
    }, [dispatch, user?.id]);

    return (
        <main className="min-h-[calc(100vh-64px)] bg-stone-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto max-w-5xl">

                <h1 className="mb-6 text-2xl font-bold text-stone-900 sm:mb-8 sm:text-3xl">
                    Your Orders
                </h1>

                {loading ? (
                    <p className="text-sm text-stone-600 sm:text-base">
                        Loading your orders...
                    </p>
                ) : error ? (
                    <p
                        role="alert"
                        className="rounded-xl bg-red-50 p-3 text-sm text-red-700 sm:p-4"
                    >
                        {error}
                    </p>
                ) : orders.length === 0 ? (
                    <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center sm:p-8">

                        <h2 className="text-lg font-semibold text-stone-800">
                            No orders yet
                        </h2>

                        <p className="mt-2 text-sm text-stone-500">
                            Your placed orders will appear here.
                        </p>

                        <Link
                            to="/productlist"
                            className="mt-5 inline-block rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                        >
                            Browse products
                        </Link>

                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-5">

                        {[...orders]
                            .sort(
                                (firstOrder, secondOrder) =>
                                    new Date(secondOrder.createdAt) -
                                    new Date(firstOrder.createdAt)
                            )
                            .map((order) => (
                                <article
                                    key={order.id}
                                    className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6"
                                >

                                    <div className="flex flex-col gap-3 border-b border-stone-100 pb-4 sm:flex-row sm:items-start sm:justify-between">

                                        <div>
                                            <h2 className="text-sm font-semibold text-stone-900 sm:text-base">
                                                Order #{order.id}
                                            </h2>

                                            <p className="mt-1 text-xs text-stone-500 sm:text-sm">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                        <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                                            {order.status}
                                        </span>

                                    </div>

                                    <div className="divide-y divide-stone-100">

                                        {(order.items ?? []).map((item) => (
                                            <div
                                                key={`${item.productId}-${item.size}-${item.color}`}
                                                className="flex items-start justify-between gap-3 py-3 sm:items-center sm:gap-4"
                                            >

                                                <div className="flex min-w-0 items-center gap-2 sm:gap-3">

                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="h-10 w-10 flex-shrink-0 rounded-lg bg-stone-50 object-contain p-1 sm:h-12 sm:w-12"
                                                        />
                                                    )}

                                                    <div className="min-w-0">
                                                        <p className="line-clamp-2 text-xs font-medium text-stone-800 sm:text-sm">
                                                            {item.name}
                                                        </p>

                                                        <p className="text-[11px] text-stone-500 sm:text-xs">
                                                            Qty: {item.quantity}
                                                            {item.size
                                                                ? ` · ${item.size}`
                                                                : ""}
                                                            {item.color
                                                                ? ` · ${item.color}`
                                                                : ""}
                                                        </p>
                                                    </div>

                                                </div>

                                                <p className="flex-shrink-0 text-xs font-semibold text-stone-900 sm:text-sm">
                                                    ₹
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toLocaleString("en-IN")}
                                                </p>

                                            </div>
                                        ))}

                                    </div>

                                    <div className="mt-4 flex flex-col gap-2 border-t border-stone-100 pt-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">

                                        <span className="text-stone-500">
                                            {order.shipping?.name
                                                ? `Ship to ${order.shipping.name}`
                                                : "Shipping details unavailable"}
                                        </span>

                                        <span className="font-bold text-stone-900">
                                            Total: ₹
                                            {(
                                                order.total ??
                                                order.totalAmount ??
                                                0
                                            ).toLocaleString("en-IN")}
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