
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../adminRedux/slices/adminAuthSlice";

function AdminLayout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const admin = useSelector((state) => state.adminAuth.admin);

    const links = [
        { name: "Dashboard", path: "/admin/dashboard", icon: "▦" },
        { name: "Products", path: "/admin/products", icon: "□" },
        { name: "Users", path: "/admin/users", icon: "♙" },
        { name: "Orders", path: "/admin/orders", icon: "▤" }
    ];

    function handleLogout() {
        dispatch(adminLogout());
        navigate("/admin/login", { replace: true });
    }

    return (
        <div className="min-h-screen bg-gray-100 md:flex">
            <aside className="w-full md:w-64 bg-gray-950 text-white md:min-h-screen p-6">
                <h1 className="text-2xl font-bold">TravelVerse</h1>
                <p className="text-blue-400 text-xs mt-1 tracking-widest">
                    ADMIN PANEL
                </p>

                <nav className="mt-10 space-y-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:bg-gray-800"
                                }`
                            }
                        >
                            <span>{link.icon}</span>
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-10 w-full text-left px-4 py-3 rounded-lg text-red-300 hover:bg-gray-800"
                >
                    Logout
                </button>
            </aside>

            <div className="flex-1 min-w-0">
                <header className="bg-white border-b px-6 py-5 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800">
                        Administration
                    </h2>
                    <span className="text-sm text-gray-600">
                        {admin?.username || "Admin"}
                    </span>
                </header>

                <main className="p-5 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
