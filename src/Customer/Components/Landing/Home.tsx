import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  Search,
  Menu,
  X,
  Plus,
  Minus,
  ArrowRight,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RefreshCw,
  Award,
} from "lucide-react";

// TypeScript interfaces
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  isNew: boolean;
  isFeatured: boolean;
  isBestDeal: boolean;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
  cta: string;
}

type ViewType = "home" | "products" | "product" | "cart";

// Mock data - replace with your actual API calls
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 124,
    category: "Electronics",
    isNew: true,
    isFeatured: true,
    isBestDeal: true,
    description:
      "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation and 30-hour battery life.",
  },
  {
    id: 2,
    name: "Smart Fitness Tracker",
    price: 199.99,
    originalPrice: 249.99,
    image:
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 89,
    category: "Fitness",
    isNew: false,
    isFeatured: true,
    isBestDeal: true,
    description:
      "Track your health and fitness goals with advanced sensors, GPS, and week-long battery life.",
  },
  {
    id: 3,
    name: "Luxury Leather Backpack",
    price: 159.99,
    originalPrice: 199.99,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 203,
    category: "Fashion",
    isNew: true,
    isFeatured: false,
    isBestDeal: false,
    description:
      "Handcrafted genuine leather backpack with multiple compartments and laptop protection.",
  },
  {
    id: 4,
    name: "Professional Camera Lens",
    price: 899.99,
    originalPrice: 1199.99,
    image:
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 67,
    category: "Photography",
    isNew: false,
    isFeatured: true,
    isBestDeal: true,
    description:
      "Professional-grade telephoto lens with image stabilization and weather sealing.",
  },
  {
    id: 5,
    name: "Minimalist Desk Setup",
    price: 449.99,
    originalPrice: 549.99,
    image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 156,
    category: "Home & Office",
    isNew: true,
    isFeatured: false,
    isBestDeal: false,
    description:
      "Complete minimalist workspace solution with ergonomic design and cable management.",
  },
  {
    id: 6,
    name: "Artisan Coffee Maker",
    price: 299.99,
    originalPrice: 379.99,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 94,
    category: "Kitchen",
    isNew: false,
    isFeatured: true,
    isBestDeal: false,
    description:
      "Precision brewing system for the perfect cup of coffee every time.",
  },
];

const categories: string[] = [
  "Electronics",
  "Fashion",
  "Home & Office",
  "Fitness",
  "Photography",
  "Kitchen",
];

const EcommerceApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [heroSlide, setHeroSlide] = useState<number>(0);

  const heroSlides: HeroSlide[] = [
    {
      title: "Premium Audio Experience",
      subtitle: "Discover our latest collection of wireless headphones",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop",
      cta: "Shop Now",
    },
    {
      title: "Fitness Revolution",
      subtitle: "Track your journey with smart fitness technology",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop",
      cta: "Explore",
    },
    {
      title: "Professional Photography",
      subtitle: "Capture life's moments with precision",
      image:
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=1200&h=600&fit=crop",
      cta: "Discover",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const addToCart = (product: Product, quantity: number = 1): void => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number): void => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, newQuantity: number): void => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleWishlist = (product: Product): void => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredProducts: Product[] = mockProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredProducts: Product[] = mockProducts.filter((p) => p.isFeatured);
  const newProducts: Product[] = mockProducts.filter((p) => p.isNew);
  const bestDeals: Product[] = mockProducts.filter((p) => p.isBestDeal);

  interface ProductCardProps {
    product: Product;
    size?: "normal" | "large";
  }

  const ProductCard: React.FC<ProductCardProps> = ({
    product,
    size = "normal",
  }) => {
    const isInWishlist: boolean = wishlist.some(
      (item) => item.id === product.id
    );
    const isInCart: boolean = cart.some((item) => item.id === product.id);
    const discount: number = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );

    return (
      <div
        className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
          size === "large" ? "h-96" : "h-80"
        }`}
      >
        <div className="relative overflow-hidden h-48">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              NEW
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              -{discount}%
            </span>
          )}
          <button
            onClick={() => toggleWishlist(product)}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
              discount > 0 ? "top-12" : ""
            } ${
              isInWishlist
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart size={16} fill={isInWishlist ? "currentColor" : "none"} />
          </button>
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              {isInCart ? "Add More" : "Add to Cart"}
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(product.rating) ? "#fbbf24" : "none"}
                className={
                  i < Math.floor(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">
              ({product.reviews})
            </span>
          </div>

          <h3
            className="font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
            onClick={() => {
              setSelectedProduct(product);
              setCurrentView("product");
            }}
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>
    );
  };

  const Header: React.FC = () => (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => setCurrentView("home")}
            >
              LUXE
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setCurrentView("home")}
                className={`font-medium transition-colors ${
                  currentView === "home"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView("products")}
                className={`font-medium transition-colors ${
                  currentView === "products"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Products
              </button>
              <button className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Categories
              </button>
              <button className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
                About
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setCurrentView("cart")}
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {getCartItemCount()}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={() => {
                setCurrentView("home");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-gray-700"
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentView("products");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-gray-700"
            >
              Products
            </button>
          </div>
        </div>
      )}
    </header>
  );

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
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3">
              {heroSlides[heroSlide].cta}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
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
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => setHeroSlide((prev) => (prev + 1) % heroSlides.length)}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
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
    <section className={`py-16 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={() => setCurrentView("products")}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 transition-colors"
          >
            View All <ArrowRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );

  const FeaturesSection: React.FC = () => (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Truck className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-gray-600 text-sm">On orders over $100</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
            <p className="text-gray-600 text-sm">100% secure transactions</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
            <p className="text-gray-600 text-sm">30-day return policy</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="text-white" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Quality Guarantee
            </h3>
            <p className="text-gray-600 text-sm">Premium quality products</p>
          </div>
        </div>
      </div>
    </section>
  );

  const CategoriesSection: React.FC = () => (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentView("products");
              }}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">
                  {category[0]}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm text-center">
                {category}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  const HomePage: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner />
      <ProductSection
        title="Featured Products"
        products={featuredProducts}
        bgColor="bg-white"
      />
      <ProductSection
        title="New Arrivals"
        products={newProducts}
        bgColor="bg-gray-50"
      />
      <FeaturesSection />
      <ProductSection
        title="Best Deals"
        products={bestDeals}
        bgColor="bg-white"
      />
      <CategoriesSection />
    </div>
  );

  const ProductsPage: React.FC = () => (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">All Products</h1>
          <div className="flex items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );

  const ProductDetailPage: React.FC = () => {
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedImage, setSelectedImage] = useState<number>(0);

    if (!selectedProduct) return null;

    const images: string[] = [
      selectedProduct.image,
      selectedProduct.image,
      selectedProduct.image,
    ];
    const discount: number = Math.round(
      ((selectedProduct.originalPrice - selectedProduct.price) /
        selectedProduct.originalPrice) *
        100
    );

    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setCurrentView("home")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
          >
            <ChevronLeft size={20} />
            Back to Products
          </button>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              <div>
                <div className="aspect-square rounded-2xl overflow-hidden mb-4">
                  <img
                    src={images[selectedImage]}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-4 justify-center">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {selectedProduct.name}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          fill={
                            i < Math.floor(selectedProduct.rating)
                              ? "#fbbf24"
                              : "none"
                          }
                          className={
                            i < Math.floor(selectedProduct.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      ({selectedProduct.reviews} reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-bold text-gray-900">
                      ${selectedProduct.price}
                    </span>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          ${selectedProduct.originalPrice}
                        </span>
                        <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          -{discount}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900">
                      Quantity:
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => addToCart(selectedProduct, quantity)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                    >
                      <ShoppingCart size={20} />
                      Add to Cart - $
                      {(selectedProduct.price * quantity).toFixed(2)}
                    </button>
                    <button
                      onClick={() => toggleWishlist(selectedProduct)}
                      className={`px-6 py-4 rounded-2xl border-2 transition-all duration-300 ${
                        wishlist.some((item) => item.id === selectedProduct.id)
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-gray-200 hover:border-red-500 hover:bg-red-50"
                      }`}
                    >
                      <Heart
                        size={20}
                        fill={
                          wishlist.some(
                            (item) => item.id === selectedProduct.id
                          )
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-blue-600" />
                      <span>Free shipping on orders over $100</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-green-600" />
                      <span>2-year warranty included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw size={16} className="text-orange-600" />
                      <span>30-day return policy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-purple-600" />
                      <span>Premium quality guaranteed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CartPage: React.FC = () => (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={() => setCurrentView("products")}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            Continue Shopping
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-lg">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => setCurrentView("products")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {item.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            ${item.price} each
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg h-fit">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {getCartTotal() > 100 ? "Free" : "$9.99"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">
                    ${(getCartTotal() * 0.08).toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">
                    $
                    {(
                      getCartTotal() +
                      (getCartTotal() > 100 ? 0 : 9.99) +
                      getCartTotal() * 0.08
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 mb-4">
                Proceed to Checkout
              </button>
              <button
                onClick={() => setCurrentView("products")}
                className="w-full border-2 border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-600 py-4 rounded-2xl font-semibold transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case "home":
        return <HomePage />;
      case "products":
        return <ProductsPage />;
      case "product":
        return <ProductDetailPage />;
      case "cart":
        return <CartPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {renderCurrentView()}
    </div>
  );
};

export default EcommerceApp;
