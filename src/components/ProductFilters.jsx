function ProductFilters({ setSearch, setCategory, setSort }) {
    return (
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-[minmax(16rem,1fr)_minmax(12rem,auto)_minmax(12rem,auto)]">

            <input
                type="text"
                placeholder="Search products..."
                aria-label="Search products"
                onChange={(event) => setSearch(event.target.value)}
                className="col-span-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-100 sm:px-4 lg:col-span-1"
            />

            <select
                aria-label="Filter by category"
                onChange={(event) => setCategory(event.target.value)}
                className="w-full cursor-pointer rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700 shadow-sm outline-none transition focus:border-orange-700 focus:ring-2 focus:ring-amber-100 sm:px-4"
            >
                <option value="All Categories">All Categories</option>
                <option value="Luggage & Bags">Luggage & Bags</option>
                <option value="Travel Organization">Travel Organization</option>
                <option value="Travel Tech">Travel Tech</option>
                <option value="Travel Comfort">Travel Comfort</option>
                <option value="Travel Essentials">Travel Essentials</option>
            </select>

            <select
                aria-label="Sort products"
                onChange={(event) => setSort(event.target.value)}
                className="w-full cursor-pointer rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700 shadow-sm outline-none transition focus:border-orange-700 focus:ring-2 focus:ring-amber-100 sm:px-4"
            >
                <option value="Default">Default</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
            </select>

        </div>
    );
}

export default ProductFilters;