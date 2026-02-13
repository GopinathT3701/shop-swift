import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBanner} alt="Hero banner" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
      </div>

      <div className="container relative mx-auto px-4 py-24 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <span className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
            New Collection 2026
          </span>
          <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-primary-foreground md:text-6xl">
            Elevate Your Everyday Style
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-primary-foreground/80">
            Discover curated collections of premium products designed to complement your lifestyle.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-8 py-3.5 text-sm font-semibold text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/10"
            >
              Browse Categories
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
