import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/slices/authSlice";
import { loadCart } from "../redux/slices/cartSlice";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const loggedInUser = await dispatch(
            loginUser({ email, password })
        ).unwrap();

        dispatch(loadCart(loggedInUser.id));

        navigate("/productlist");
    } catch (error) {
        console.log(error);
    }
};

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-6">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">

                <div className="mb-7 text-center">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                        TravelVerse
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to continue your journey.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-slate-800 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-700/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="font-semibold text-blue-700 hover:text-blue-800"
                    >
                        Create one
                    </button>
                </p>

            </section>
        </main>
    );
}

export default Login;
