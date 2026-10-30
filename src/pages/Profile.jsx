
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
        <div className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-8 text-3xl font-bold text-slate-900">
                    Profile
                </h1>

                <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

                    {/* Avatar */}
                    <div className="flex items-center gap-5 border-b border-slate-200 pb-7">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white">
                            {user?.fullName?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">
                                {user?.fullName}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                @{user?.username}
                            </p>
                        </div>
                    </div>

                    {/* User Information */}
                    <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

                        <div>
                            <p className="text-sm text-slate-500">
                                Full Name
                            </p>
                            <p className="mt-1 font-medium text-slate-900">
                                {user?.fullName}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Username
                            </p>
                            <p className="mt-1 font-medium text-slate-900">
                                @{user?.username}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Email
                            </p>
                            <p className="mt-1 break-all font-medium text-slate-900">
                                {user?.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Member Since
                            </p>
                            <p className="mt-1 font-medium text-slate-900">
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

                    {/* Logout */}
                    <div className="mt-8 flex justify-center border-t border-slate-200 pt-6">
                        <button
                            onClick={handleLogout}
                            className="rounded-lg bg-red-600 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
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
