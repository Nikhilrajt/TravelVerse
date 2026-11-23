function AdminHeader({ title, admin, onLogout }) {
    return (
        <header className="flex min-h-20 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6 lg:px-8">

            <div>
                <h2 className="font-serif text-lg font-semibold text-brand sm:text-xl">
                    {title}
                </h2>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    Manage your TravelVerse store
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-5">

                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 font-semibold text-brand">
                        {admin?.username?.charAt(0).toUpperCase() || "A"}
                    </div>

                    <div className="hidden min-w-0 sm:block">
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
                    className="min-h-11 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 sm:px-4"
                >
                    Logout
                </button>

            </div>
        </header>
    );
}

export default AdminHeader;