export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  count: number;
}

export const categories: Category[] = [
  { id: 1, name: "Electronics", icon: "💻", count: 234 },
  { id: 2, name: "Fashion", icon: "👗", count: 412 },
  { id: 3, name: "Grocery", icon: "🛒", count: 156 },
  { id: 4, name: "Home & Living", icon: "🏠", count: 89 },
  { id: 5, name: "Beauty", icon: "✨", count: 198 },
  { id: 6, name: "Sports", icon: "⚽", count: 67 },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "Electronics",
    rating: 4.8,
    reviews: 2341,
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Premium Leather Crossbody Bag",
    price: 189.00,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    category: "Fashion",
    rating: 4.6,
    reviews: 876,
  },
  {
    id: 3,
    name: "Smart Fitness Watch Pro",
    price: 249.99,
    originalPrice: 329.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "Electronics",
    rating: 4.7,
    reviews: 1523,
    badge: "New",
  },
  {
    id: 4,
    name: "Organic Green Tea Collection",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
    category: "Grocery",
    rating: 4.5,
    reviews: 432,
  },
  {
    id: 5,
    name: "Minimalist Desk Lamp",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop",
    category: "Home & Living",
    rating: 4.4,
    reviews: 267,
  },
  {
    id: 6,
    name: "Running Shoes Ultra Boost",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "Sports",
    rating: 4.9,
    reviews: 3102,
    badge: "Top Rated",
  },
  {
    id: 7,
    name: "Luxury Skincare Set",
    price: 89.99,
    originalPrice: 120.00,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
    category: "Beauty",
    rating: 4.3,
    reviews: 654,
  },
  {
    id: 8,
    name: "Vintage Sunglasses Collection",
    price: 129.00,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    category: "Fashion",
    rating: 4.6,
    reviews: 981,
    badge: "Trending",
  },
];
