import { useSelector } from "react-redux";

function AdminProducts() {

  const products = useSelector((state) => state.product.products);
  const totalProducts = products.length;
  const stockedProducts = products.filter(
    (product) => product.stock > 0
  );
  const totalStocked = stockedProducts.length;
  const lowStockProducts = products.filter(
    (product) => product.stock <= 5
  );

  const lowStock = lowStockProducts.length;

  return (
    <div className="w-full space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Products
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Manage your store products and inventory.
          </p>
        </div>

        <button className="bg-[#3F2B96] hover:bg-[#33227D] text-white px-5 py-3 rounded-lg text-sm font-medium transition">
          + Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">


        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            {totalProducts}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">In stock Products</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            {totalStocked}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Low Stock</p>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            {lowStock}
          </h2>
        </div>
      </div>

<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {products.map((product) => (
          <tr key={product.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3 min-w-[220px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                />
                <span className="text-sm font-medium text-gray-900">
                  {product.name}
                </span>
              </div>
            </td>

            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
              {product.category}
            </td>

            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
              ₹{product.price}
            </td>

            <td className="px-6 py-4 text-sm text-gray-700">
              {product.stock}
            </td>

            <td className="px-6 py-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  product.stock > 0
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </td>

            <td className="px-6 py-4">
              <div className="flex items-center gap-3 whitespace-nowrap">
                <button className="text-[#3F2B96] hover:text-[#33227D] text-sm font-medium transition">
                  Edit
                </button>

                <button className="text-red-500 hover:text-red-700 text-sm font-medium transition">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
       </table>
  </div>
</div>
</div>
);
}

export default AdminProducts;