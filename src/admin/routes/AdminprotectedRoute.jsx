import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
    const admin = useSelector((state) => state.adminAuth.admin);

    return admin ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export default AdminProtectedRoute;