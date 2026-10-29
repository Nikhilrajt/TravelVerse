import { Link } from "react-router-dom";

function ProductCard({ product }) {
    return (
        <Link to={`/product/${product.id}`}>
        <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {product.featured && (
                    
                    <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                        Featured
                    </span>
                )}
            </div>

            <div className="p-5">

                <p className="mb-2 text-sm font-medium text-gray-500">
                    {product.category}
                </p>

                <h3 className="mb-2 line-clamp-2 min-h-12 text-lg font-semibold text-gray-900">
                    {product.name}
                </h3>

                <div className="mb-3 flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                        ★ {product.rating}
                    </span>

                    <span className="text-sm text-gray-400">
                        ({product.reviewCount})
                    </span>
                </div>

                <p className="text-xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString("en-IN")}
                </p>

            </div>
        </div>
        </Link>
    );
}

export default ProductCard;
