
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import { useState } from "react";

function ProductList() {
    const products = useSelector((state) => state.product.products);
    const isLoading = useSelector((state) => state.product.loading);
    const error = useSelector((state) => state.product.error);
    const [search,setSearch] = useState("");
    const [category,setCategory] = useState("All Categories");
    const [sort,setSort] = useState("Default");
    const [pages,setPages] = useState(1);
    const filteredProducts = products.filter((product)=>{
        const matchesSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesCategory = category === "All Categories" ||
            product.category === category;
         return matchesCategory && matchesSearch;
    })
    const sortedProducts = filteredProducts.sort((a,b)=>{
        if(sort === "Price: Low to High"){
            return a.price-b.price;
        }
        if(sort === "Price: High to Low"){
            return b.price-a.price;
        }
        
});

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

    if (products.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-lg font-medium text-gray-500">
                    No products found.
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
                setSort={setSort}/>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {sortedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </section>
    );
}

export default ProductList;
