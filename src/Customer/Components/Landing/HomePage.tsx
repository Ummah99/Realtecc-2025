import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../Store/Store";
import { fetchAllProducts } from "../../../Services/ProductCustomer/ProductSlice";
import { addItemToCart } from "../../../Services/cart/CartSlice";
import { addToWishList } from "../../../Services/wishlist/WushListSlice";
import { Product } from "../../../types/product/ProductTypes";
import {
  ShoppingCart,
  Heart,
  Star,
  ArrowRight,
  Truck,
  Shield,
  RefreshCw,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { dummyProducts } from "./dummyProducts";

interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
  cta: string;
}

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const { jwt } = useSelector((state: RootState) => state.auth);
  const [heroSlide, setHeroSlide] = useState<number>(0);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);

  const heroSlides: HeroSlide[] = [
    {
      title: "Premium Products",
      subtitle: "Discover our latest collection of premium products",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop",
      cta: "Shop Now",
    },
    {
      title: "Quality & Style",
      subtitle: "Experience excellence in every product",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop",
      cta: "Explore",
    },
    {
      title: "Latest Collection",
      subtitle: "Stay ahead with our newest arrivals",
      image:
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=1200&h=600&fit=crop",
      cta: "Discover",
    },
  ];

  useEffect(() => {
    // Fetch all products on component mount
    dispatch(fetchAllProducts({ page: 0, size: 12 }));
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (error && products.length === 0) {
      toast.error("Could not fetch products. Displaying sample data.");
      setDisplayProducts(dummyProducts);
    } else {
      setDisplayProducts(products);
    }
  }, [products, loading, error]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleAddToCart = async (product: Product) => {
    if (!jwt) {
      toast.info("Please login to add items to your cart");
      navigate("/customer/login");
      return;
    }

    try {
      const cartItem = {
        productId: product.id,
        quantity: 1,
        size: product.availableSizes?.[0] || "M",
      };

      await dispatch(addItemToCart({ cartItem, jwt })).unwrap();
      toast.success("Product added to cart!");
    } catch (error) {
      toast.error("Failed to add product to cart");
    }
  };

  const handleAddToWishlist = async (product: Product) => {
    if (!jwt) {
      toast.info("Please login to add items to your wishlist");
      navigate("/customer/login");
      return;
    }

    try {
      await dispatch(addToWishList({ productId: product.id, jwt })).unwrap();
      toast.success("Product added to wishlist!");
    } catch (error) {
      toast.error("Failed to add product to wishlist");
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  // Filter products for different sections
  const featuredProducts = displayProducts.slice(0, 6);
  const newProducts = displayProducts.slice(0, 4);
  const bestDeals = displayProducts
    .filter((product) => product.discountPercentage > 20)
    .slice(0, 4);

  interface ProductCardProps {
    product: Product;
    size?: "normal" | "large";
  }

  const ProductCard: React.FC<ProductCardProps> = ({
    product,
    size = "normal",
  }) => {
    const discount = product.discountPercentage;
    const rating = product.reviews?.length
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 4.5;

    return (
      <div
        className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
          size === "large" ? "h-96" : "h-80"
        }`}
      >
        <div className="relative overflow-hidden h-48">
          <img
            src={product.images[0] || "https://via.placeholder.com/400"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              -{Math.round(discount)}%
            </span>
          )}

          <button
            onClick={() => handleAddToWishlist(product)}
            className="absolute top-3 left-3 p-2 rounded-full bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            <Heart size={16} />
          </button>

          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <button
              onClick={() => handleAddToCart(product)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
                className={
                  i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                }
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">
              ({product.numbsRatings || 0})
            </span>
          </div>

          <h3
            className="font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
            onClick={() => handleProductClick(product.id)}
          >
            {product.title}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.sellingPrice}
            </span>
            {product.mrpPrice > product.sellingPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.mrpPrice}
              </span>
            )}
          </div>

          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {product.category?.name || "Product"}
          </span>
        </div>
      </div>
    );
  };

  const HeroBanner: React.FC = () => (
    <section className="relative h-[70vh] overflow-hidden rounded-3xl mx-4 mt-4">
      <div className="absolute inset-0">
        <img
          src={heroSlides[heroSlide].image}
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {heroSlides[heroSlide].title}
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {heroSlides[heroSlide].subtitle}
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            >
              {heroSlides[heroSlide].cta}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setHeroSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === heroSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      <button
        onClick={() =>
          setHeroSlide(
            (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
          )
        }
        className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => setHeroSlide((prev) => (prev + 1) % heroSlides.length)}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );

  interface ProductSectionProps {
    title: string;
    products: Product[];
    bgColor?: string;
  }

  const ProductSection: React.FC<ProductSectionProps> = ({
    title,
    products,
    bgColor = "bg-gray-50",
  }) => (
    <section className={`py-20 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );

  const FeaturesSection: React.FC = () => (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Truck,
              title: "Free Shipping",
              description: "Free shipping on orders over $100",
            },
            {
              icon: Shield,
              title: "Secure Payment",
              description: "Your payment information is safe",
            },
            {
              icon: RefreshCw,
              title: "Easy Returns",
              description: "30-day return policy",
            },
            {
              icon: Award,
              title: "Quality Guarantee",
              description: "We guarantee product quality",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl mb-4">
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner />

      {featuredProducts.length > 0 && (
        <ProductSection
          title="Featured Products"
          products={featuredProducts}
          bgColor="bg-white"
        />
      )}

      <FeaturesSection />

      {newProducts.length > 0 && (
        <ProductSection
          title="New Arrivals"
          products={newProducts}
          bgColor="bg-gray-50"
        />
      )}

      {bestDeals.length > 0 && (
        <ProductSection
          title="Best Deals"
          products={bestDeals}
          bgColor="bg-white"
        />
      )}
    </div>
  );
};

export default HomePage;
