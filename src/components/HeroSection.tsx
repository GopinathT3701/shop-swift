import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import banner1 from "@/assets/hero-banner.jpg";
import banner2 from "@/assets/agri2.jpg";
import banner3 from "@/assets/agri3.jpg";
import banner4 from "@/assets/agri4.jpg";

const HeroSection = () => {
  const slides = [banner1, banner2, banner3, banner4];

  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
  <Swiper
    modules={[Autoplay, Pagination]}
    autoplay={{ delay: 4000 }}
    pagination={{ clickable: true }}
    loop={true}
    className="h-full w-full"
  >
    {slides.map((image, index) => (
      <SwiperSlide key={index}>
        <div className="relative h-[85vh] w-full">
              
              {/* Background Image */}
              <img
                src={image}
                alt="Agriculture Banner"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Content */}
              <div className="container relative z-10 mx-auto px-4 py-12 md:py-8 h-full flex items-start pt-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="max-w-xl text-white"
                >
                  <span className="mb-4 inline-block rounded-full bg-green-600/30 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                    Fresh From Farms 🌾
                  </span>

                  <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
                    Pure & Organic <br /> Agricultural Products
                  </h1>

                  <p className="mb-8 text-lg text-white/80">
                    Farm-fresh vegetables and grains directly sourced
                    from trusted farmers.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 rounded-full bg-green-600 px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-105"
                    >
                      Shop Now <ArrowRight className="h-5 w-5" />
                    </Link>

                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 rounded-full border border-white px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
                    >
                      Browse Categories
                    </Link>
                  </div>
                </motion.div>
              </div>

            </div>
      </SwiperSlide>
    ))}
  </Swiper>
</section>
  );
};

export default HeroSection;
