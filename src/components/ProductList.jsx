
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import { useState, useEffect } from "react";

function ProductList() {
    const products = useSelector((state) => state.product.products);
    const isLoading = useSelector((state) => state.product.loading);
    const error = useSelector((state) => state.product.error);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [sort, setSort] = useState("Default");
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 8;
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesCategory = category === "All Categories" ||
            product.category === category;
        return matchesCategory && matchesSearch;
    })
    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sort === "Price: Low to High") {
            return a.price - b.price;
        }
        else if (sort === "Price: High to Low") {
            return b.price - a.price;
        }
        else if (sort === "Default") {
            return 0;
        }

    });
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const totalPages = Math.ceil(sortedProducts.length / perPage);
    const currentProducts = sortedProducts.slice(startIndex, endIndex);
    useEffect(() => {
        setCurrentPage(1);
    }, [search, category, sort])
    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-lg font-medium text-gray-500">
                    Loading products...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-lg font-medium text-red-500">
                    {error}
                </p>
            </div>
        );
    }

    return (
          <section className="mx-auto max-w-7xl px-6 py-12">

            <div className="mb-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                    TravelVerse Collection
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Explore Our Products
                </h1>

                <p className="mt-2 text-gray-500">
                    Everything you need for the journey ahead.
                </p>
            </div>
            <ProductFilters
                setSearch={setSearch}
                setCategory={setCategory}
                setSort={setSort} />
            {sortedProducts.length === 0 ? (
                <div className="flex min-h-[40vh] items-center justify-center">
                    <p className="text-lg font-medium text-gray-500">
                        No products found.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {currentProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            )}
            {sortedProducts.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <button
                        onClick={() =>
                            setCurrentPage((previousPage) => previousPage - 1)
                        }
                        disabled={currentPage === 1}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                    >
                        Previous
                    </button>

                    <span className="min-w-24 text-center text-sm font-medium text-gray-600" aria-live="polite">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() =>
                            setCurrentPage((previousPage) => previousPage + 1)
                        }
                        disabled={currentPage === totalPages}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
}

export default ProductList;
