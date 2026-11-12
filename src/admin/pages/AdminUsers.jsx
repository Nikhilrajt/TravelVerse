import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminUsers, updateAdminUserStatus } from "../adminRedux/slices/adminUserSlice";
import { Users, UserPlus, MapPin } from "lucide-react";

function AdminUsers() {
  const users = useSelector((state) => state.adminUser.users);

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
        <h1 className="text-2xl font-bold text-gray-800">
          Users Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and monitor your registered customers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {totalUsers}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users size={23} className="text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Registered customers
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">New Users</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-2">
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

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Cities Covered</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-2">
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


      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Registered Users
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor your registered customers.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
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
              {users.map((user) => (
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
                      className={`px-3 py-1 rounded-full text-xs font-medium ${user.isBlocked
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
                        onClick={() => {
                          dispatch(
                            updateAdminUserStatus({
                              userId: user.id,
                              isBlocked: !user.isBlocked
                            })
                          );
                        }}
                        className={`text-sm font-medium ${user.isBlocked
                            ? "text-green-600 hover:text-green-800"
                            : "text-red-600 hover:text-red-800"
                          }`}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-500">
                    No registered users found.
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