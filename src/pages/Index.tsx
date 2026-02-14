import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { products, categories } from "@/data/products";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const featuredProducts = products.slice(0, 4);
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Shop by Category
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Find exactly what you're looking for
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Featured Products
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Handpicked items just for you
            </p>
          </div>

          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-primary">
        <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-16 text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
            Get 20% Off Your First Order
          </h2>

          <p className="max-w-md text-primary-foreground/80">
            Sign up today and receive an exclusive discount on your first purchase.
          </p>

          {!isLoggedIn ? (
            <Link
              to="/register"
              className="rounded-full bg-card px-8 py-3 text-sm font-semibold text-foreground transition-transform hover:scale-105"
            >
              Create Account
            </Link>
          ) : (
            <Link
              to="/profile"
              className="rounded-full bg-card px-8 py-3 text-sm font-semibold text-foreground transition-transform hover:scale-105"
            >
              Go to Profile
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
