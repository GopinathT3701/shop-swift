import { useSearchParams, useLocation } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const activeCategory = searchParams.get("category") || "All";
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  // 1️⃣ Filter by Category
  let filtered = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  // 2️⃣ Filter by Search
  if (searchQuery) {
    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(location.search);

    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }

    setSearchParams(params);
  };

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          All Products
        </h1>

        {searchQuery && (
          <p className="mt-2 text-sm text-muted-foreground">
            Search results for "<span className="font-medium">{searchQuery}</span>"
          </p>
        )}

        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} products found
        </p>
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {["All", ...categories.map((c) => c.name)].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-muted-foreground">
          No products found.
        </div>
      )}
    </div>
  );
};

export default Products;
