import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import { useState, useEffect, useMemo } from "react";
import { ArrowDown, RotateCcw } from "lucide-react";
import { fetchProducts } from "../redux/slices/productSlice";

function ProductList() {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.product.products);
    const isLoading = useSelector((state) => state.product.loading);
    const error = useSelector((state) => state.product.error);
    const user = useSelector((state) => state.auth.user);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [sort, setSort] = useState("Default");
    const [currentPage, setCurrentPage] = useState(1);

    // Mix categories in a stable order so each visit shows a varied first page.
    const mixedProducts = useMemo(() => {
        const shuffle = (items) => {
            const result = [...items];
            for (let index = result.length - 1; index > 0; index -= 1) {
                const swapIndex = Math.floor(Math.random() * (index + 1));
                [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
            }
            return result;
        };

        const groups = new Map();
        products.forEach((product) => {
            const group = groups.get(product.category) || [];
            group.push(product);
            groups.set(product.category, group);
        });

        const categories = shuffle([...groups.keys()]);
        const shuffledGroups = new Map(
            categories.map((name) => [name, shuffle(groups.get(name))])
        );
        const mixed = [];

        while (categories.some((name) => shuffledGroups.get(name).length > 0)) {
            categories.forEach((name) => {
                const group = shuffledGroups.get(name);
                if (group.length > 0) mixed.push(group.pop());
            });
        }

        return mixed;
    }, [products]);

    const perPage = 8;
    const normalizedSearch = search.trim().toLowerCase();

    const catalogProducts = category === "All Categories" ? mixedProducts : products;
    const filteredProducts = catalogProducts.filter((product) => {
        const matchesSearch = [product.name, product.category, product.description]
            .some((value) => String(value ?? "").toLowerCase().includes(normalizedSearch));

        const matchesCategory =
            category === "All Categories" ||
            product.category === category;

        return matchesCategory && matchesSearch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sort === "Price: Low to High") {
            return a.price - b.price;
        } else if (sort === "Price: High to Low") {
            return b.price - a.price;
        }
        return 0;
    });

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const totalPages = Math.ceil(sortedProducts.length / perPage);
    const currentProducts = sortedProducts.slice(startIndex, endIndex);
    const hasActiveFilters = Boolean(normalizedSearch) || category !== "All Categories" || sort !== "Default";

    const clearFilters = () => {
        setSearch("");
        setCategory("All Categories");
        setSort("Default");
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [search, category, sort]);

    if (isLoading) {
        return (
            <section aria-label="Loading travel essentials" className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <div className="mb-6 grid animate-pulse overflow-hidden rounded-lg border border-stone-200 bg-white md:grid-cols-[1.15fr_0.85fr]">
                    <div className="space-y-4 bg-brand p-7 sm:p-10">
                        <div className="h-3 w-36 rounded bg-white/20" />
                        <div className="h-10 max-w-md rounded bg-white/20" />
                        <div className="h-4 max-w-sm rounded bg-white/15" />
                    </div>
                    <div className="h-48 bg-stone-200 sm:h-56" />
                </div>
                <div className="mb-6 grid animate-pulse grid-cols-1 gap-3 rounded-lg border border-stone-200 bg-white p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[minmax(16rem,1fr)_minmax(12rem,auto)_minmax(12rem,auto)]">
                    <div className="h-11 rounded-md bg-stone-100 sm:col-span-2 lg:col-span-1" />
                    <div className="h-11 rounded-md bg-stone-100" />
                    <div className="h-11 rounded-md bg-stone-100" />
                </div>
                <p className="sr-only" role="status">Loading products...</p>
                <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }, (_, index) => (
                        <div key={index} className="animate-pulse overflow-hidden rounded-lg border border-stone-200 bg-white p-3 sm:p-4">
                            <div className="aspect-[4/3] rounded-md bg-stone-100" />
                            <div className="mt-4 h-3 w-1/3 rounded bg-stone-100" />
                            <div className="mt-3 h-5 rounded bg-stone-100" />
                            <div className="mt-2 h-5 w-2/3 rounded bg-stone-100" />
                            <div className="mt-5 h-11 rounded-md bg-stone-100" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mx-auto flex min-h-[55vh] max-w-7xl items-center justify-center px-4 py-10 sm:px-6">
                <div className="w-full max-w-lg rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
                    <p className="font-serif text-xl font-semibold text-brand">We couldn’t load the collection</p>
                    <p role="alert" className="mt-2 text-sm leading-6 text-error">{error}</p>
                    <button
                        type="button"
                        onClick={() => dispatch(fetchProducts())}
                        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
                    >
                        <RotateCcw size={15} aria-hidden="true" />
                        Try again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">

            <div className="mb-6 grid overflow-hidden rounded-lg border border-stone-200 bg-brand shadow-sm md:mb-8 md:grid-cols-[1.15fr_0.85fr]">
                <div className="flex flex-col justify-center px-6 py-6 sm:px-10 sm:py-8 lg:px-14 lg:py-9">
                    {user && (
                        <p className="mb-2 text-sm font-semibold text-white/80 sm:text-base">
                            Welcome back, {user.fullName?.trim() || user.username || "there"}
                        </p>
                    )}
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-accent-light sm:text-xs">
                        TravelVerse Collection
                    </p>
                    <h1 className="max-w-xl font-serif text-3xl font-medium leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl">
                        Make every journey feel easier.
                    </h1>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
                        Thoughtful travel essentials for the miles ahead.
                    </p>
                    <a
                        href="#travel-essentials"
                        className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-surface-muted focus-visible:outline"
                    >
                        Explore the collection
                        <ArrowDown size={16} aria-hidden="true" />
                    </a>
                </div>
                <div className="relative h-48 overflow-hidden border-t border-white/10 bg-stone-100 sm:h-56 md:h-auto md:min-h-56 md:border-l md:border-t-0">
                    <img
                        src="/images/hero-traveler.jpg"
                        alt="Traveler with a backpack walking toward a mountain vista"
                        className="absolute inset-0 h-full w-full object-cover object-[center_68%] brightness-[0.96] saturate-[0.85]"
                    />
                </div>
            </div>

            <ProductFilters
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                sort={sort}
                setSort={setSort}
            />

            <div id="travel-essentials" className="mb-4 flex scroll-mt-32 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-accent-hover">The collection</p>
                    <h2 className="font-serif text-2xl font-semibold text-brand sm:text-3xl">Travel essentials</h2>
                    <p className="mt-1 text-sm text-stone-500">Thoughtful gear for airport days, road trips, and everything in between.</p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <p className="text-sm text-stone-500" aria-live="polite">
                        {sortedProducts.length === 0
                            ? "No products"
                            : `Showing ${startIndex + 1}–${Math.min(endIndex, sortedProducts.length)} of ${sortedProducts.length}`}
                    </p>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-brand transition hover:bg-white hover:text-brand-hover"
                        >
                            <RotateCcw size={14} aria-hidden="true" />
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {sortedProducts.length === 0 ? (
                <div className="flex min-h-[40vh] items-center justify-center rounded-lg border border-stone-200 bg-white px-4 shadow-sm">
                    <div className="max-w-sm text-center">
                        <p className="font-serif text-xl font-semibold text-brand">No products found</p>
                        <p className="mt-2 text-sm leading-6 text-stone-500">Try a different search or clear your filters to browse the full collection.</p>
                        {hasActiveFilters && (
                            <button type="button" onClick={clearFilters} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover">
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
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
                            setCurrentPage(
                                (previousPage) => previousPage - 1
                            )
                        }
                        disabled={currentPage === 1}
                        className="min-h-11 rounded-md border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 shadow-sm transition hover:border-accent hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white sm:text-sm"
                    >
                        Previous
                    </button>

                    <span
                        className="min-w-20 text-center text-xs font-medium text-stone-600 sm:min-w-24 sm:text-sm"
                        aria-live="polite"
                    >
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() =>
                            setCurrentPage(
                                (previousPage) => previousPage + 1
                            )
                        }
                        disabled={currentPage === totalPages}
                        className="min-h-11 rounded-md border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 shadow-sm transition hover:border-accent hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white sm:text-sm"
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
}

export default ProductList;
