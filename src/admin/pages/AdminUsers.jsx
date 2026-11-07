
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAdminUsers,
    toggleUserBlock
} from "../adminRedux/slices/adminDataSlice";

function AdminUsers() {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector(
        (state) => state.adminData
    );

    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(fetchAdminUsers());
    }, [dispatch]);

    const filteredUsers = users.filter((user) =>
        `${user.username} ${user.email} ${user.fullName || ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    async function handleToggle(user) {
        const isBlocked = !user.isBlocked;

        try {
            await dispatch(
                toggleUserBlock({ id: user.id, isBlocked })
            ).unwrap();
        } catch (err) {
            alert(err);
        }
    }

    return (
        <div>
            <div className="mb-7">
                <h1 className="text-3xl font-bold">Users</h1>
                <p className="text-gray-500 mt-2">
                    Manage registered customers.
                </p>
            </div>

            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, username or email..."
                className="w-full sm:max-w-md p-3 border rounded-lg mb-6 bg-white"
            />

            {loading && <p className="text-gray-500 mb-3">Loading users...</p>}
            {error && <p className="text-red-500 mb-3">{error}</p>}

            <div className="bg-white rounded-xl border overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-t">
                                <td className="p-4">
                                    {user.fullName || user.username}
                                    <p className="text-xs text-gray-400">
                                        @{user.username}
                                    </p>
                                </td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    {user.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString()
                                        : "—"}
                                </td>
                                <td className="p-4">
                                    <span className={
                                        user.isBlocked
                                            ? "text-red-600"
                                            : "text-green-600"
                                    }>
                                        {user.isBlocked ? "Blocked" : "Active"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleToggle(user)}
                                        className={
                                            user.isBlocked
                                                ? "text-green-600 hover:underline"
                                                : "text-red-600 hover:underline"
                                        }
                                    >
                                        {user.isBlocked ? "Unblock" : "Block"}
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminUsers;
