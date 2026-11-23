
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLoginThunk } from "../adminRedux/slices/adminAuthSlice";

function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error: loginError } = useSelector(
        (state) => state.adminAuth
    );

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (username.trim() === "") {
            setError("Username is required");
            return;
        }

        if (password.trim() === "") {
            setError("Password is required");
            return;
        }
try {
    await dispatch(adminLoginThunk({ username, password })).unwrap();
    navigate("/admin/dashboard");
} catch {
}
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">

            <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md sm:p-10">

                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl font-semibold tracking-tight text-brand">
                        TravelVerse
                    </h1>
                    <p className="mt-1 text-sm font-semibold tracking-[0.16em] text-accent-hover">
                        ADMIN PANEL
                    </p>
                    <p className="text-gray-500 text-sm mt-5">
                        Login to access your dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            placeholder="Enter your username"
                            onChange={(event) => {
                                setUsername(event.target.value);
                                setError("");
                            }}
                            className="min-h-11 w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                placeholder="Enter your password"
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setError("");
                                }}
                                className="min-h-11 w-full rounded-md border border-gray-300 px-4 py-3 pr-16 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 min-h-11 -translate-y-1/2 text-sm font-medium text-brand hover:text-brand-hover"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {(error || loginError) && (
                        <p className="text-red-500 text-sm" role="alert">
                            {error || loginError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="min-h-11 w-full rounded-md bg-brand py-3 font-semibold text-white transition hover:bg-brand-hover disabled:opacity-50"
                    >
                        {loading ? "SIGNING IN..." : "SIGN IN"}
                    </button>

                </form>

                <p className="text-center text-xs text-gray-400 mt-8">
                    TravelVerse Admin Dashboard
                </p>

            </div>
        </div>
    );
}

export default AdminLogin;
