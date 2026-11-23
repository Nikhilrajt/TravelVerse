import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminUsers, updateAdminUserStatus } from "../adminRedux/slices/adminUserSlice";
import { Users, UserPlus, MapPin, Search, X } from "lucide-react";

function AdminUsers() {
  const { users, error, updatingUserId } = useSelector((state) => state.adminUser);
  const [search, setSearch] = useState("");

  const normalizedSearch = search.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    const searchableDetails = [
      user.fullName,
      user.username,
      user.email,
      user.address?.phone,
      user.address?.city
    ];

    return searchableDetails.some((detail) =>
      String(detail ?? "").toLowerCase().includes(normalizedSearch)
    );
  });

  const totalUsers = users.length;

  const newUsers = users.filter((user) => {
    const registeredDate = new Date(user.createdAt);
    const currentDate = new Date();

    const difference = currentDate - registeredDate;
    const days = difference / (1000 * 60 * 60 * 24);

    return days >= 0 && days <= 30;
  }).length;

  const citiesCovered = new Set(
    users
      .map((user) => user.address?.city?.trim().toLowerCase())
      .filter(Boolean)
  ).size;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  return (
    <div className="space-y-8">

      <div>
        <h1 className="font-serif text-2xl font-semibold text-brand">
          Users Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and monitor your registered customers.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          User management error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-brand">
                {totalUsers}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Users size={23} className="text-orange-900" />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Registered customers
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">New Users</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-brand">
                {newUsers}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <UserPlus size={23} className="text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Joined in the last 30 days
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Cities Covered</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-brand">
                {citiesCovered}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <MapPin size={23} className="text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Across registered customers
          </p>
        </div>

      </div>


      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">

        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-lg font-semibold text-brand">
                Registered Users
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredUsers.length} of {users.length} customers.
              </p>
            </div>
            <div className="relative w-full sm:max-w-sm">
              <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, phone, or city"
                aria-label="Search registered users"
                className="min-h-11 w-full rounded-md border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear user search"
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Username</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">City</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">

                  <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                    {user.fullName}
                  </td>

                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {user.username}
                  </td>

                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {user.email}
                  </td>

                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {user.address?.phone || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {user.address?.city || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${user.isBlocked
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                        }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={String(updatingUserId) === String(user.id)}
                        onClick={() => {
                          dispatch(
                            updateAdminUserStatus({
                              userId: user.id,
                              isBlocked: !user.isBlocked
                            })
                          );
                        }}
                        className={`min-h-11 rounded-md px-2 text-sm font-medium disabled:cursor-wait disabled:opacity-50 ${user.isBlocked
                            ? "text-green-600 hover:text-green-800"
                            : "text-red-600 hover:text-red-800"
                          }`}
                      >
                        {String(updatingUserId) === String(user.id)
                          ? "Updating..."
                          : user.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-500">
                    {users.length === 0
                      ? "No registered users found."
                      : `No users match “${search}”.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default AdminUsers
