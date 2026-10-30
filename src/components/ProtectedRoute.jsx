import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    const authInitialized = useSelector(
        (state) => state.auth.authInitialized
    );

    if (!authInitialized) {
        return null;
    }

    if (isAuthenticated) {
        return <Outlet />;
    }

    return <Navigate to="/login" replace />;
}

export default ProtectedRoute;