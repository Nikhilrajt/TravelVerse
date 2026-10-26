
function ProductFilters({setSearch,setCategory,setSort}) {

    return (
        <div className="mb-8">
            <input
                type="text"
                placeholder="Search products..."
                onChange={(event)=>setSearch(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 sm:max-w-md"
            />
            <select
            onChange={(event)=>setCategory(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 sm:max-w-xs">
                <option value="All Categories">All Categories</option>
                <option value="Luggage & Bags">Luggage & Bags</option>
                <option value="Travel Organization">Travel Organization</option>
                <option value="Travel Tech">Travel Tech</option>
                <option value="Travel Comfort">Travel Comfort</option>
                <option value="Travel Essentials">Travel Essentials</option>
            </select>
            <select
            onChange={(event)=>setSort(event.target.value)}>
              <option value="Default">Default</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
        </div>
    );
}

export default ProductFilters;