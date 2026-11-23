
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import {
  addNewProduct,
  updateExistingProduct,
  removeProduct
} from "../../redux/slices/productSlice";

function AdminProducts() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const productsPerPage = 8;

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

  const filteredProducts = products.filter((product) => {
    const searched = search.toLowerCase().trim();

    return (
      product.name?.toLowerCase().includes(searched) ||
      String(product.id).toLowerCase().includes(searched) ||
      product.category?.toLowerCase().includes(searched)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

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
    try {
      await dispatch(removeProduct(productId)).unwrap();
      setDeletingProduct(null);
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

      {deletingProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <svg
                className="h-7 w-7 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 11v5m4-5v5"
                />
              </svg>
            </div>

            <h2 className="text-center font-serif text-xl font-semibold text-gray-900">
              Delete Product?
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {deletingProduct.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">

              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="min-h-11 rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleDelete(deletingProduct.id)}
                className="min-h-11 rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete Product
              </button>

            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:p-6">

            <form onSubmit={handleSubmit} className="space-y-5">

              <h2 className="font-serif text-xl font-semibold text-brand">
                {editingProduct ? "Edit Product" : "Add New Product"}
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
                  className="min-h-11 w-full rounded-md border border-gray-300 bg-canvas px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
                  className="w-full resize-none rounded-md border border-gray-300 bg-canvas px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    className="min-h-11 w-full rounded-md border border-gray-300 bg-canvas px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
                    className="min-h-11 w-full rounded-md border border-gray-300 bg-canvas px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
                  className="min-h-11 w-full rounded-md border border-gray-300 bg-canvas px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
                  className="min-h-11 w-full rounded-md border border-gray-300 bg-canvas px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
                  className="min-h-11 w-full rounded-md border border-gray-300 bg-canvas px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
                  className="min-h-11 w-full rounded-md border border-gray-300 bg-canvas px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="h-4 w-4 accent-accent"
                />
                <label className="text-sm font-medium text-gray-700">
                  Mark as Featured Product
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="min-h-11 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="min-h-11 w-full rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-hover sm:w-auto"
                >
                  {editingProduct ? "Update Product" : "Save Product"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-brand sm:text-3xl">
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
          className="min-h-11 rounded-md bg-brand px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-hover"
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-brand">
            {totalProducts}
          </h2>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">In Stock Products</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-brand">
            {totalStocked}
          </h2>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Low Stock</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-brand">
            {lowStock}
          </h2>
        </div>

      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <div className="relative w-full sm:max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" strokeWidth="2" />
            <path
              d="m16 16 4 4"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, ID or category..."
            className="min-h-11 w-full rounded-md border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>

        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {filteredProducts.length}
          </span>{" "}
          of {totalProducts} products
        </p>

      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">

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

              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <p className="text-gray-700 font-medium">
                      No products found
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try another product name, ID or category.
                    </p>
                  </td>
                </tr>
              ) : (
                currentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-md border border-gray-200 object-contain p-1"
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
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${product.stock === 0
                          ? "bg-red-50 text-red-700"
                          : product.stock <= 5
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-green-50 text-green-700"
                          }`}
                      >
                        {product.stock === 0
                          ? "Out of Stock"
                          : product.stock <= 5
                            ? "Low Stock"
                            : "In Stock"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(product)}
                          className="min-h-11 rounded-sm px-2 text-sm font-medium text-brand transition hover:text-brand-hover"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeletingProduct(product)}
                          className="min-h-11 rounded-sm px-2 text-sm font-medium text-red-600 transition hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="flex flex-col justify-between gap-4 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:px-6">

            <p className="text-sm text-gray-500 text-center sm:text-left">
              Showing{" "}
              <span className="font-medium text-gray-800">
                {indexOfFirstProduct + 1}–{Math.min(indexOfLastProduct, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-800">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>

            <div className="flex items-center justify-center gap-2 flex-wrap">

              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="min-h-11 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`min-h-11 min-w-11 rounded-md text-sm font-medium transition ${currentPage === index + 1
                    ? "bg-brand text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-amber-50 hover:text-brand"
                    }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="min-h-11 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminProducts;
