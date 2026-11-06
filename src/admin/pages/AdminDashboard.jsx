
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../adminRedux/slices/adminAuthSlice";

function AdminDashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const admin = useSelector((state) => state.adminAuth.admin);

    function handleLogout() {
        dispatch(adminLogout());
        navigate("/admin/login");
    }

    return (
        <div className="min-h-screen bg-gray-100">

            <header className="bg-white border-b border-gray-200 px-6 py-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            TravelVerse
                        </h1>
                        <p className="text-sm text-blue-600 font-medium">
                            ADMIN PANEL
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">

                <div className="mb-10">
                    <p className="text-sm text-gray-500 mb-2">
                        Dashboard / Overview
                    </p>

                    <h2 className="text-3xl font-bold text-gray-900">
                        Welcome back, {admin?.username || "Admin"}!
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Manage your TravelVerse store from your admin dashboard.
                    </p>
                </div>

                <div className="bg-gray-900 rounded-2xl p-8 sm:p-10 text-white">
                    <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider">
                        Admin Dashboard
                    </p>

                    <h3 className="text-2xl sm:text-3xl font-bold mt-3">
                        Your store, your control.
                    </h3>

                    <p className="text-gray-300 mt-3 max-w-xl leading-relaxed">
                        Manage products, monitor customer activity, and
                        keep track of orders — all from one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">

                    {[
                        {
                            title: "Products",
                            description: "Manage your store products and inventory.",
                            icon: "📦"
                        },
                        {
                            title: "Users",
                            description: "View and manage registered customers.",
                            icon: "👥"
                        },
                        {
                            title: "Orders",
                            description: "Review and manage customer orders.",
                            icon: "🛍️"
                        }
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
                        >
                            <span className="text-3xl">{item.icon}</span>

                            <h3 className="text-lg font-bold text-gray-900 mt-4">
                                {item.title}
                            </h3>

                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}

                </div>

                <p className="text-center text-sm text-gray-400 mt-12">
                    TravelVerse Admin Dashboard
                </p>

            </main>
        </div>
    );
}

export default AdminDashboard;
