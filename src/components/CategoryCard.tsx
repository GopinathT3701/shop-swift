import { Link } from "react-router-dom";
import { Category } from "@/data/products";
import { motion } from "framer-motion";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

const CategoryCard = ({ category, index = 0 }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link
        to={`/products?category=${category.name}`}
        className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-md"
      >
        <span className="text-4xl">{category.icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{category.name}</h3>
        <p className="text-xs text-muted-foreground">{category.count} items</p>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
