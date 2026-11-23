import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";

function Register() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setValidationError("");

    if (!fullName.trim()) {
      setValidationError("Full name is required");
      return;
    }

    if (!username.trim()) {
      setValidationError("Username is required");
      return;
    }

    if (!/^[A-Za-z0-9_]+$/.test(username)) {
      setValidationError(
        "Username can only contain letters, numbers, and underscores"
      );
      return;
    }

    if (!email.trim()) {
      setValidationError("Email is required");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setValidationError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }

    if (!confirmPassword) {
      setValidationError("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    const userData = {
      fullName: fullName,
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    };

    const result = await dispatch(registerUser(userData));

    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-7 sm:px-6">

      <section className="w-full max-w-xl rounded-lg border border-stone-200 bg-white p-6 shadow-md sm:p-10">

        <div className="mb-5 text-center sm:mb-6">

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand sm:text-sm">
            TravelVerse
          </p>

          <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Sign up to start planning your next journey.
          </p>

        </div>

        <form onSubmit={handleSubmit} className="grid gap-x-5 gap-y-3.5 sm:grid-cols-2">

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              className="min-h-11 w-full rounded-md border border-stone-300 bg-canvas px-3.5 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 sm:text-base"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              className="min-h-11 w-full rounded-md border border-stone-300 bg-canvas px-3.5 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 sm:text-base"
            />
          </div>

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

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              className="min-h-11 w-full rounded-md border border-stone-300 bg-canvas px-3.5 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 sm:text-base"
            />
          </div>

          {validationError && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3.5 py-3 text-sm text-red-700 sm:col-span-2"
            >
              {validationError}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3.5 py-3 text-sm text-red-700 sm:col-span-2"
            >
              {error}
            </p>
          )}

          <div className="pt-1 sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="min-h-11 w-full rounded-md bg-brand px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
            >
              {loading
                ? "Creating Account..."
                : "Register"}
            </button>
          </div>

        </form>

        <p className="mt-5 text-center text-sm text-stone-500 sm:mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-brand underline-offset-4 hover:text-brand-hover hover:underline"
          >
            Login
          </button>
        </p>

      </section>

    </main>
  );
}

export default Register;
