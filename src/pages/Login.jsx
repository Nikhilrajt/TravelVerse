import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/slices/authSlice";
import { loadCart } from "../redux/slices/cartSlice";
import { loadWishlist } from "../redux/slices/wishlistSlice";

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
            dispatch(loadWishlist(loggedInUser.id));

            navigate("/productlist");
        } catch (error) {
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-8 sm:px-6">

            <section className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-md sm:p-10">

                <div className="mb-6 text-center sm:mb-7">

                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand sm:text-sm">
                        TravelVerse
                    </p>

                    <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-stone-500">
                        Sign in to continue your journey.
                    </p>

                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-stone-700">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            className="min-h-11 w-full rounded-md border border-stone-300 bg-canvas px-3.5 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 sm:text-base"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-stone-700">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            className="min-h-11 w-full rounded-md border border-stone-300 bg-canvas px-3.5 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 sm:text-base"
                        />
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-md bg-red-50 px-3.5 py-3 text-sm text-red-700"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="min-h-11 w-full rounded-md bg-brand px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>

                </form>

                <p className="mt-5 text-center text-sm text-stone-500 sm:mt-6">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="font-semibold text-brand underline-offset-4 hover:text-brand-hover hover:underline"
                    >
                        Create one
                    </button>
                </p>

            </section>
        </main>
    );
}

export default Login;
