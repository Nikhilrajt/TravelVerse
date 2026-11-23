import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Users, ShoppingBag } from "lucide-react";

function AdminSidebar() {
    const menuItems = [
        { label: "Dashboard", icon: "LayoutDashboard", path: "/admin/dashboard" },
        { label: "Products", icon: "Package", path: "/admin/products" },
        { label: "Users", icon: "Users", path: "/admin/users" },
        { label: "Orders", icon: "ShoppingBag", path: "/admin/orders" },
    ];
    const icons = {
        LayoutDashboard,
        Package,
        Users,
        ShoppingBag
    };

    return (
        <aside className="flex w-full flex-col border-b border-gray-200 bg-white md:fixed md:inset-y-0 md:left-0 md:z-30 md:h-screen md:w-64 md:border-b-0 md:border-r">

            <div className="border-b border-gray-100 px-4 py-4 sm:px-6 md:py-7">
                <h1 className="font-serif text-xl font-semibold text-brand sm:text-2xl">
                    TravelVerse
                </h1>
                <p className="mt-1 text-[11px] font-semibold tracking-[0.16em] text-accent-hover">
                    ADMIN PANEL
                </p>
            </div>

            <nav className="min-w-0 flex-1 px-3 py-3 sm:px-4 md:py-6">

                <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:gap-0 md:space-y-2 md:overflow-visible md:pb-0">
                    {menuItems.map((item) => {
                        const Icon = icons[item.icon];
                        return (
                            <NavLink
                                to={item.path}
                                key={item.label}
                                className={({ isActive }) =>
                                    `flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 py-2.5 transition-colors duration-200 sm:gap-3 sm:px-4 md:w-full md:py-3 ${isActive
                                        ? "bg-brand text-white"
                                        : "text-gray-600 hover:bg-amber-50 hover:text-brand"
                                    }`
                                }
                            >
                                <Icon size={18} />
                                <span className="text-sm font-medium">
                                    {item.label}
                                </span>
                            </NavLink>
                        )
                    }
                    )}
                </div>
            </nav>

            <div className="hidden border-t border-gray-100 px-6 py-5 md:block">
                <p className="text-xs text-gray-400">
                    TravelVerse © 2026
                </p>
            </div>

        </aside>
    );
}

export default AdminSidebar;
