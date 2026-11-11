function AdminHeader({ title, admin, onLogout }) {
    return (
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">

            <div>
                <h2 className="text-xl font-semibold text-gray-800">
                    {title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your TravelVerse store
                </p>
            </div>

            <div className="flex items-center gap-5">

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-[#3F2B96] font-semibold">
                        {admin?.username?.charAt(0).toUpperCase() || "A"}
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-800">
                            {admin?.username || "Admin"}
                        </p>
                        <p className="text-xs text-gray-500">
                            Administrator
                        </p>
                    </div>
                </div>

                <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                >
                    Logout
                </button>

            </div>
        </header>
    );
}

export default AdminHeader;