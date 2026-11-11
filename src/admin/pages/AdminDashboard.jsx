import { useSelector } from "react-redux";
import { Package, Users, ShoppingBag, ArrowUpRight } from "lucide-react";

function AdminDashboard() {
    const admin = useSelector((state) => state.adminAuth.admin);

    return (
        <div className="w-full">
            <main className="w-full space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-[#5F5AA2] mb-2">
                            Dashboard Overview
                        </p>

                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Welcome back, {admin?.username || "Admin"}!
                        </h2>

                        <p className="text-sm text-gray-500 mt-2">
                            Here's what's happening with your store today.
                        </p>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-r from-[#3F2B96] to-[#5F5AA2] rounded-2xl p-8 sm:p-10 text-white">
                    <div className="relative z-10 max-w-xl">
                        <p className="text-purple-200 text-sm font-semibold uppercase tracking-wider">
                            Admin Dashboard
                        </p>

                        <h3 className="text-2xl sm:text-3xl font-bold mt-3">
                            Your store, your control.
                        </h3>

                        <p className="text-purple-100 mt-3 leading-relaxed">
                            Manage products, monitor customer activity, and
                            keep track of orders — all from one place.
                        </p>
                    </div>

                    <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full" />
                    <div className="absolute right-20 -top-20 w-40 h-40 bg-white/10 rounded-full" />
                </div>

<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

    {[
        {
            title: "Products",
            description: "Manage your store products and inventory.",
            icon: Package,
        },
        {
            title: "Users",
            description: "View and manage registered customers.",
            icon: Users,
        },
        {
            title: "Orders",
            description: "Review and manage customer orders.",
            icon: ShoppingBag,
        }
    ].map((item) => {
        const Icon = item.icon;

        return (
            <div
                key={item.title}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-[#5F5AA2] hover:shadow-lg transition-all duration-300"
            >
                <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#3F2B96] flex items-center justify-center">
                        <Icon size={23} />
                    </div>

                    <ArrowUpRight
                        size={20}
                        className="text-gray-400 group-hover:text-[#3F2B96] transition"
                    />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mt-5">
                    {item.title}
                </h3>

                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    {item.description}
                </p>
            </div>
        );
    })}

</div>
            </main>
        </div>
    );
}

export default AdminDashboard;
