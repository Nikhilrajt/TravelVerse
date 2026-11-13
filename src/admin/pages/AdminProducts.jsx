
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { addNewProduct, updateExistingProduct, removeProduct } from "../../redux/slices/productSlice";

function AdminProducts() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
    sizes: "",
    colors: "",
    rating: 0,
    reviewCount: 0,
    featured: false
  });

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

  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      ...product,
      sizes: product.sizes.join(", "),
      colors: product.colors.join(", ")
    });

    setShowForm(true);
  };
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await dispatch(removeProduct(productId)).unwrap();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      sizes: formData.sizes
        .split(",")
        .map((size) => size.trim())
        .filter((size) => size !== ""),
      colors: formData.colors
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color !== ""),
    };
    try {
      if (editingProduct) {
        await dispatch(
          updateExistingProduct({
            productId: editingProduct.id,
            updatedData: newProduct
          })
        ).unwrap();
      } else {
        await dispatch(addNewProduct(newProduct)).unwrap();
      }

      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };
  return (
    <div className="w-full space-y-8">

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">

            <form onSubmit={handleSubmit} className="space-y-5">

              <h2 className="text-xl font-bold text-gray-900">
                Add New Product
              </h2>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter product name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3F2B96]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter product description"
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3F2B96] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="Enter price"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3F2B96]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="Enter quantity"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3F2B96]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3F2B96]"
                >
                  <option value="">Select Category</option>
                  <option value="Luggage & Bags">Luggage & Bags</option>
                  <option value="Travel Organization">Travel Organization</option>
                  <option value="Travel Tech">Travel Tech</option>
                  <option value="Travel Comfort">Travel Comfort</option>
                  <option value="Travel Essentials">Travel Essentials</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Image Path
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="/images/products/product-name.webp"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3F2B96]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Available Sizes
                </label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) =>
                    setFormData({ ...formData, sizes: e.target.value })
                  }
                  placeholder="Example: 20L, 30L, 40L"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3F2B96]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Available Colors
                </label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) =>
                    setFormData({ ...formData, colors: e.target.value })
                  }
                  placeholder="Example: Black, Blue, Grey"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3F2B96]"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#3F2B96]"
                />
                <label className="text-sm font-medium text-gray-700">
                  Mark as Featured Product
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#3F2B96] rounded-lg hover:bg-[#33227D]"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Products
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Manage your store products and inventory.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: "",
              description: "",
              price: "",
              category: "",
              image: "",
              stock: "",
              sizes: "",
              colors: "",
              rating: 0,
              reviewCount: 0,
              featured: false
            });
            setShowForm(true);
          }}
          className="bg-[#3F2B96] hover:bg-[#33227D] text-white px-5 py-3 rounded-lg text-sm font-medium transition"
        >
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
          <p className="text-sm text-gray-500">In Stock Products</p>
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
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${product.stock > 0
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                        }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <button onClick={() => handleEdit(product)} className="text-[#3F2B96] hover:text-[#33227D] text-sm font-medium transition">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                      >
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
