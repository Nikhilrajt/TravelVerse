
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { addAdminProduct } from "../adminRedux/slices/adminDataSlice";

function AdminAddProduct() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState({
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

    const [error, setError] = useState("");

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

        const price = Number(form.price);
        const stock = Number(form.stock);

        if (!form.name.trim()) {
            setError("Product name is required.");
            return;
        }

        if (!form.category.trim()) {
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

        const product = {
            ...form,
            name: form.name.trim(),
            category: form.category.trim(),
            description: form.description.trim(),
            price,
            stock,
            sizes: form.sizes.split(",").map((v) => v.trim()).filter(Boolean),
            colors: form.colors.split(",").map((v) => v.trim()).filter(Boolean),
            rating: Number(form.rating) || 0,
            reviewCount: Number(form.reviewCount) || 0
        };

        try {
            await dispatch(addAdminProduct(product)).unwrap();
            navigate("/admin/products");
        } catch (err) {
            setError(err || "Unable to add product.");
        }
    }

    const fields = [
        ["name", "Product name", "text"],
        ["category", "Category", "text"],
        ["price", "Price", "number"],
        ["stock", "Stock", "number"],
        ["image", "Image path (e.g. /images/bag.jpg)", "text"],
        ["sizes", "Sizes (comma separated)", "text"],
        ["colors", "Colors (comma separated)", "text"]
    ];

    return (
        <div className="max-w-3xl">
            <Link to="/admin/products" className="text-blue-600 text-sm">
                ← Back to Products
            </Link>

            <h1 className="text-3xl font-bold mt-5 mb-7">Add Product</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-5">
                {fields.map(([name, label, type]) => (
                    <div key={name}>
                        <label className="block text-sm font-semibold mb-2">
                            {label}
                        </label>
                        <input
                            name={name}
                            type={type}
                            value={form[name]}
                            onChange={handleChange}
                            required={["name", "category", "price", "stock"].includes(name)}
                            min={type === "number" ? 0 : undefined}
                            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                ))}

                <div>
                    <label className="block text-sm font-semibold mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full border rounded-lg p-3"
                    />
                </div>

                <label className="flex gap-3 items-center">
                    <input
                        type="checkbox"
                        name="featured"
                        checked={form.featured}
                        onChange={handleChange}
                    />
                    Featured product
                </label>

                {error && <p className="text-red-500">{error}</p>}

                <button
                    type="submit"
                    className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                >
                    Save Product
                </button>
            </form>
        </div>
    );
}

export default AdminAddProduct;
