import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Hero = () => {
  return (
    <section className="w-full h-[85vh]">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 4000 }}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        className="h-full"
      >
        {/* 🌾 Slide 1 */}
        <SwiperSlide>
          <div
            className="h-full flex items-center text-white"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1500595046743-ee9b6c2c8a9d?auto=format&fit=crop&w=1600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-black/50 w-full h-full flex items-center">
              <div className="max-w-6xl mx-auto px-6">
                <h1 className="text-5xl font-bold">
                  Fresh From Farmers 🌾
                </h1>
                <p className="mt-4 text-lg max-w-xl">
                  Direct farm vegetables, rice, and grains delivered fresh to your home.
                </p>
                <button className="mt-6 bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 transition">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* 🌿 Slide 2 */}
        <SwiperSlide>
          <div
            className="h-full flex items-center text-white"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-black/50 w-full h-full flex items-center">
              <div className="max-w-6xl mx-auto px-6">
                <h1 className="text-5xl font-bold">
                  100% Organic Products 🍃
                </h1>
                <p className="mt-4 text-lg max-w-xl">
                  No chemicals. No preservatives. Pure natural farming products.
                </p>
                <button className="mt-6 bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 transition">
                  Explore Now
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* 🚜 Slide 3 */}
        <SwiperSlide>
          <div
            className="h-full flex items-center text-white"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-black/50 w-full h-full flex items-center">
              <div className="max-w-6xl mx-auto px-6">
                <h1 className="text-5xl font-bold">
                  Farm to Home Delivery 🚜
                </h1>
                <p className="mt-4 text-lg max-w-xl">
                  Fresh harvest packed and delivered within 24 hours.
                </p>
                <button className="mt-6 bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 transition">
                  Order Today
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* 🌱 Slide 4 */}
        <SwiperSlide>
          <div
            className="h-full flex items-center text-white"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-black/50 w-full h-full flex items-center">
              <div className="max-w-6xl mx-auto px-6">
                <h1 className="text-5xl font-bold">
                  Healthy Living Starts Here 🌱
                </h1>
                <p className="mt-4 text-lg max-w-xl">
                  Choose fresh. Choose local. Choose healthy.
                </p>
                <button className="mt-6 bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 transition">
                  Start Shopping
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default Hero;
