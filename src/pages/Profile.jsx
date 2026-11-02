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
        <div className="min-h-[calc(100vh-73px)] bg-stone-50 px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-5xl">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">
                        Profile
                    </h1>

                    <p className="mt-1 text-sm text-stone-500">
                        View your account details.
                    </p>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-8 lg:p-10">

                    <div className="border-l-4 border-amber-800 pl-3 sm:pl-4">
                        <h2 className="text-base font-semibold text-stone-900 sm:text-lg">
                            Account information
                        </h2>

                        <p className="mt-1 text-xs text-stone-500 sm:text-sm">
                            Your personal details and membership information.
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">

                        <div className="min-h-24 rounded-xl border border-stone-200/80 bg-gradient-to-br from-stone-50 to-white p-4 sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                                Full Name
                            </p>

                            <p className="mt-2 break-words text-sm font-semibold text-stone-900 sm:text-base">
                                {user?.fullName}
                            </p>
                        </div>

                        <div className="min-h-24 rounded-xl border border-stone-200/80 bg-gradient-to-br from-stone-50 to-white p-4 sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                                Username
                            </p>

                            <p className="mt-2 break-words text-sm font-semibold text-stone-900 sm:text-base">
                                @{user?.username}
                            </p>
                        </div>

                        <div className="min-h-24 rounded-xl border border-stone-200/80 bg-gradient-to-br from-stone-50 to-white p-4 sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                                Email
                            </p>

                            <p className="mt-2 break-all text-sm font-semibold text-stone-900 sm:text-base">
                                {user?.email}
                            </p>
                        </div>

                        <div className="min-h-24 rounded-xl border border-stone-200/80 bg-gradient-to-br from-stone-50 to-white p-4 sm:p-5">
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
                            className="w-full rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-amber-800 hover:bg-amber-50 hover:text-amber-900 sm:w-auto"
                        >
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Profile;