
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    fetchAdminProducts,
    deleteAdminProduct
} from "../adminRedux/slices/adminDataSlice";

function AdminProducts() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector(
        (state) => state.adminData
    );

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 6;

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    const filtered = useMemo(
        () => products.filter((product) =>
            product.name?.toLowerCase().includes(search.toLowerCase())
        ),
        [products, search]
    );

    const totalPages = Math.ceil(filtered.length / pageSize);
    const currentProducts = filtered.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    async function handleDelete(id) {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await dispatch(deleteAdminProduct(id)).unwrap();
            } catch (error) {
                alert(error);
            }
        }
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-7">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-gray-500 mt-1">
                        Manage your store inventory.
                    </p>
                </div>

                <Link
                    to="/admin/products/add"
                    className="bg-gray-900 text-white px-5 py-3 rounded-lg text-center hover:bg-gray-700"
                >
                    + Add Product
                </Link>
            </div>

            <input
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
                placeholder="Search products..."
                className="w-full sm:max-w-sm p-3 rounded-lg border bg-white mb-6 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {loading && <p className="text-gray-500">Loading products...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && filtered.length === 0 && (
                <div className="bg-white p-10 rounded-xl text-center text-gray-500">
                    No products found.
                </div>
            )}

            <div className="bg-white rounded-xl border overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-4">Product</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product) => (
                            <tr key={product.id} className="border-t">
                                <td className="p-4">
                                    <div className="flex items-center gap-3 min-w-48">
                                        {product.image && (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                        )}
                                        <span className="font-medium">
                                            {product.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">{product.category}</td>
                                <td className="p-4">
                                    ₹{Number(product.price).toLocaleString("en-IN")}
                                </td>
                                <td className="p-4">{product.stock}</td>
                                <td className="p-4">
                                    <div className="flex gap-3">
                                        <Link
                                            to={`/admin/products/edit/${product.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:underline"
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

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 bg-white border rounded-lg disabled:opacity-40"
                    >
                        Previous
                    </button>
                    <span className="text-sm">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 bg-white border rounded-lg disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;
