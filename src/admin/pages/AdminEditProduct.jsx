
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    fetchAdminProducts,
    updateAdminProduct
} from "../adminRedux/slices/adminDataSlice";

function AdminEditProduct() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { products, loading } = useSelector((state) => state.adminData);
    const product = products.find((item) => String(item.id) === id);

    const [form, setForm] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!product) {
            dispatch(fetchAdminProducts());
        } else {
            setForm({
                ...product,
                sizes: (product.sizes || []).join(", "),
                colors: (product.colors || []).join(", ")
            });
        }
    }, [product, dispatch]);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!form) {
            return;
        }

        const price = Number(form.price);
        const stock = Number(form.stock);

        if (!form.name?.trim()) {
            setError("Product name is required.");
            return;
        }

        if (!form.category?.trim()) {
            setError("Category is required.");
            return;
        }

        if (!Number.isFinite(price) || price <= 0) {
            setError("Price must be a valid number greater than 0.");
            return;
        }

        if (!Number.isFinite(stock) || stock < 0) {
            setError("Stock must be 0 or more.");
            return;
        }

        const updated = {
            ...form,
            name: form.name.trim(),
            category: form.category.trim(),
            description: form.description?.trim() || "",
            price,
            stock,
            sizes: form.sizes.split(",").map((v) => v.trim()).filter(Boolean),
            colors: form.colors.split(",").map((v) => v.trim()).filter(Boolean)
        };

        try {
            await dispatch(updateAdminProduct({ id, product: updated })).unwrap();
            navigate("/admin/products");
        } catch (err) {
            setError(err || "Unable to update product.");
        }
    }

    if (!form) {
        return (
            <p className="text-gray-500">
                {loading ? "Loading product..." : "Product not found."}
            </p>
        );
    }

    const fields = [
        ["name", "Product name", "text"],
        ["category", "Category", "text"],
        ["price", "Price", "number"],
        ["stock", "Stock", "number"],
        ["image", "Image path", "text"],
        ["sizes", "Sizes (comma separated)", "text"],
        ["colors", "Colors (comma separated)", "text"]
    ];

    return (
        <div className="max-w-3xl">
            <Link to="/admin/products" className="text-blue-600 text-sm">
                ← Back to Products
            </Link>

            <h1 className="text-3xl font-bold mt-5 mb-7">Edit Product</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-5">
                {fields.map(([name, label, type]) => (
                    <div key={name}>
                        <label className="block text-sm font-semibold mb-2">
                            {label}
                        </label>
                        <input
                            name={name}
                            type={type}
                            value={form[name] ?? ""}
                            onChange={handleChange}
                            required={["name", "category", "price", "stock"].includes(name)}
                            min={type === "number" ? 0 : undefined}
                            className="w-full border rounded-lg p-3"
                        />
                    </div>
                ))}

                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={form.description || ""}
                        onChange={handleChange}
                        rows="4"
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="featured"
                        checked={Boolean(form.featured)}
                        onChange={handleChange}
                    />
                    Featured product
                </label>

                {error && <p className="text-red-500">{error}</p>}

                <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-lg">
                    Update Product
                </button>
            </form>
        </div>
    );
}

export default AdminEditProduct;
