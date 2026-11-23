import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../redux/slices/authSlice";

function Profile() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLogout() {
        dispatch(logOut());
        navigate("/login");
    }

    return (
        <div className="min-h-[calc(100vh-73px)] px-4 py-7 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-5xl">

                <div className="mb-7 border-b border-stone-300 pb-6 sm:mb-9 sm:pb-7">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brand">Your account</p>
                    <h1 className="font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">
                        Profile
                    </h1>

                    <p className="mt-1 text-sm text-stone-500">
                        View your account details.
                    </p>
                </div>

                <div className="grid overflow-hidden border border-stone-200 bg-white shadow-sm lg:grid-cols-[0.72fr_1.28fr]">

                    <div className="border-b border-stone-200 bg-white p-6 text-stone-800 sm:p-9 lg:border-b-0 lg:border-r lg:p-11">
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-accent/30 bg-amber-50 text-2xl font-semibold text-brand">
                            {(user?.fullName?.trim() || user?.username || "U").charAt(0).toUpperCase()}
                        </div>
                        <h2 className="font-serif text-base font-semibold text-stone-900 sm:text-lg">
                            Account information
                        </h2>

                        <p className="mt-1 text-xs text-stone-500 sm:text-sm">
                            Your personal details and membership information.
                        </p>
                    </div>

                    <div className="p-5 sm:p-8 lg:p-10">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

                        <div className="min-h-24 rounded-md border border-stone-200 bg-surface-muted p-4 sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                                Full Name
                            </p>

                            <p className="mt-2 break-words text-sm font-semibold text-stone-900 sm:text-base">
                                {user?.fullName}
                            </p>
                        </div>

                        <div className="min-h-24 rounded-md border border-stone-200 bg-surface-muted p-4 sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                                Username
                            </p>

                            <p className="mt-2 break-words text-sm font-semibold text-stone-900 sm:text-base">
                                @{user?.username}
                            </p>
                        </div>

                        <div className="min-h-24 rounded-md border border-stone-200 bg-surface-muted p-4 sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                                Email
                            </p>

                            <p className="mt-2 break-all text-sm font-semibold text-stone-900 sm:text-base">
                                {user?.email}
                            </p>
                        </div>

                        <div className="min-h-24 rounded-md border border-stone-200 bg-surface-muted p-4 sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                                Member Since
                            </p>

                            <p className="mt-2 text-sm font-semibold text-stone-900 sm:text-base">
                                {user?.createdAt
                                    ? new Date(
                                        user.createdAt
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })
                                    : "N/A"}
                            </p>
                        </div>

                    </div>

                    <div className="mt-6 flex justify-stretch border-t border-stone-200 pt-5 sm:mt-7 sm:justify-end">
                        <button
                            onClick={handleLogout}
                            className="min-h-11 w-full rounded-md border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-accent hover:bg-amber-50 hover:text-brand sm:w-auto"
                        >
                            Logout
                        </button>
                    </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
