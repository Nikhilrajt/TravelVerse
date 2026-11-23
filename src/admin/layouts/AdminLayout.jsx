import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { adminLogout } from "../adminRedux/slices/adminAuthSlice";
function AdminLayout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const admin = useSelector((state) => state.adminAuth.admin);

    const pageTitles = {
        "/admin/dashboard": "Dashboard",
        "/admin/products": "Products",
        "/admin/users": "Users",
        "/admin/orders": "Orders",
    };

    function handleLogout() {
        dispatch(adminLogout());
        navigate("/admin/login");
    }

    return (
        <div className="flex min-h-screen flex-col bg-canvas md:flex-row md:pl-64">
            <AdminSidebar />

            <div className="flex-1 min-w-0">
                <AdminHeader
                    title={pageTitles[location.pathname] || "Admin"}
                    admin={admin}
                    onLogout={handleLogout}
                />

                <main className="min-w-0 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
