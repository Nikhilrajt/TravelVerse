import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 px-4">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="authentication-prompt-title"
                className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl"
            >
                <h1
                    id="authentication-prompt-title"
                    className="text-xl font-bold text-stone-900"
                >
                    Please log in or sign up
                </h1>
                <p className="mt-2 text-sm text-stone-600">
                    You need an account to access this page.
                </p>
                <Link
                    to="/login"
                    className="mt-6 block w-full rounded-lg bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                    Log in
                </Link>
                <Link
                    to="/register"
                    className="mt-3 block w-full rounded-lg border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                    Sign up
                </Link>
                <Link
                    to="/productlist"
                    className="mt-4 inline-block text-sm font-medium text-stone-500 hover:text-stone-700"
                >
                    Maybe later
                </Link>
            </section>
        </div>
    );
}

export default ProtectedRoute;