
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
        } catch (err) {
            setError(err || "Invalid username or password");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        TravelVerse
                    </h1>
                    <p className="text-sm font-medium text-blue-600 mt-1">
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                                className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800"
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
                        className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition"
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
