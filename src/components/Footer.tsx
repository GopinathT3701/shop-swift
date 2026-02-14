import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">S</div>
              <span className="font-display text-lg font-semibold">ShopVibe</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your destination for premium products at unbeatable prices. Quality meets style.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Shop</h4>
            <div className="flex flex-col gap-2">
              <Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Products</Link>
              <Link to="/products?category=Electronics" className="text-sm text-muted-foreground hover:text-primary transition-colors">Electronics</Link>
              <Link to="/products?category=Fashion" className="text-sm text-muted-foreground hover:text-primary transition-colors">Fashion</Link>
              <Link to="/products?category=Beauty" className="text-sm text-muted-foreground hover:text-primary transition-colors">Beauty</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Company</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">About Us</span>
              <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">Contact</span>
              <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"><Link to="/privacy">Privacy Policy</Link></span>
              <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Follow Us</h4>
            <div className="flex gap-3">
              {["Twitter", "Instagram", "Facebook", "YouTube"].map((social) => (
                <span key={social} className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                  {social[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © 2026 ShopVibe. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
