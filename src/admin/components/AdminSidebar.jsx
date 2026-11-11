import { NavLink } from "react-router-dom";

function AdminSidebar() {
    const menuItems = [
        { label: "Dashboard", icon: "LayoutDashboard", path: "/admin/dashboard" },
        { label: "Products", icon: "Package", path: "/admin/products" },
        { label: "Users", icon: "Users", path: "/admin/users" },
        { label: "Orders", icon: "ShoppingBag", path: "/admin/orders" },
    ];

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">

            <div className="px-6 py-7 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-[#3F2B96]">
                    TravelVerse
                </h1>
                <p className="text-xs text-gray-500 mt-1 tracking-wider">
                    ADMIN PANEL
                </p>
            </div>

            <nav className="flex-1 px-4 py-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
                    Main Menu
                </p>

                <div className="space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            to={item.path}
                            key={item.label}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${isActive
                                    ? "bg-[#3F2B96] text-white"
                                    : "text-gray-600 hover:bg-purple-50 hover:text-[#3F2B96]"
                                }`
                            }
                        >
                            <span className="text-sm font-medium">
                                {item.label}
                            </span>
                        </NavLink>
                    ))}
                </div>
            </nav>

            <div className="px-6 py-5 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                    TravelVerse © 2026
                </p>
            </div>

        </aside>
    );
}

export default AdminSidebar;