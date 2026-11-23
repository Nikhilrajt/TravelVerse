import { Search, X } from "lucide-react";

function ProductFilters({ search, setSearch, category, setCategory, sort, setSort }) {
    return (
        <div className="mb-6 grid grid-cols-1 gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-[minmax(16rem,1fr)_minmax(12rem,auto)_minmax(12rem,auto)]">

            <div className="relative w-full sm:col-span-2 lg:col-span-1">
                <Search
                    size={17}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                    type="text"
                    placeholder="Search products..."
                    aria-label="Search products"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="min-h-11 w-full rounded-md border border-stone-300 bg-canvas py-2.5 pl-10 pr-10 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20"
                />
                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch("")}
                        aria-label="Clear product search"
                        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline"
                    >
                        <X size={16} aria-hidden="true" />
                    </button>
                )}
            </div>

            <select
                aria-label="Filter by category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="min-h-11 w-full cursor-pointer rounded-md border border-stone-300 bg-canvas px-3 py-2.5 text-sm text-stone-700 outline-none transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 sm:px-4"
            >
                <option value="All Categories">All Categories</option>
                <option value="Luggage & Bags">Luggage &amp; Bags</option>
                <option value="Travel Organization">Travel Organization</option>
                <option value="Travel Tech">Travel Tech</option>
                <option value="Travel Comfort">Travel Comfort</option>
                <option value="Travel Essentials">Travel Essentials</option>
            </select>

            <select
                aria-label="Sort products"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="min-h-11 w-full cursor-pointer rounded-md border border-stone-300 bg-canvas px-3 py-2.5 text-sm text-stone-700 outline-none transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 sm:px-4"
            >
                <option value="Default">Default</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
            </select>

        </div>
    );
}

export default ProductFilters;
