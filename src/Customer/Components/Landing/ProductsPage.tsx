import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../Store/Store";
import {
  fetchAllProducts,
  searchProducts,
} from "../../../Services/ProductCustomer/ProductSlice";
import { addItemToCart } from "../../../Services/cart/CartSlice";
import { addToWishList } from "../../../Services/wishlist/WushListSlice";
import { Product } from "../../../types/product/ProductTypes";
import {
  ShoppingCart,
  Heart,
  Star,
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { dummyProducts } from "./dummyProducts";

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { products, loading, totalPages, error } = useSelector(
    (state: RootState) => state.product
  );
  const { jwt } = useSelector((state: RootState) => state.auth);

  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Home & Office",
    "Fitness",
    "Photography",
    "Kitchen",
  ];
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "rating", label: "Best Rating" },
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      dispatch(
        searchProducts({
          query: searchQuery,
          page: currentPage,
          size: 12,
          sort: sortBy,
        })
      );
    } else {
      dispatch(
        fetchAllProducts({
          page: currentPage,
          size: 12,
          sort: sortBy,
          category: selectedCategory !== "All" ? selectedCategory : undefined,
        })
      );
    }
  }, [dispatch, currentPage, searchQuery, selectedCategory, sortBy]);

  useEffect(() => {
    if (loading) {
      // While loading, we can show an empty list or keep the old data
      return;
    }

    if (error && products.length === 0) {
      toast.error("Could not fetch products. Displaying sample data.");
      setDisplayProducts(dummyProducts);
    } else {
      setDisplayProducts(products);
    }
  }, [products, loading, error]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const filteredProducts = displayProducts.filter((product) => {
    const matchesPrice =
      product.sellingPrice >= priceRange.min &&
      product.sellingPrice <= priceRange.max;
    return matchesPrice;
  });

  interface ProductCardProps {
    product: Product;
    viewMode: "grid" | "list";
  }

  const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
    const discount = product.discountPercentage;
    const rating = product.reviews?.length
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 4.5;

    if (viewMode === "list") {
      return (
        <div className="flex bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="w-48 h-48 relative">
            <img
              src={product.images[0] || "https://via.placeholder.com/400"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                -{Math.round(discount)}%
              </span>
            )}
          </div>

          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
                    className={
                      i < Math.floor(rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  ({product.numbsRatings || 0})
                </span>
              </div>

              <h3
                className="text-xl font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => handleProductClick(product.id)}
              >
                {product.title}
              </h3>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {product.description}
              </p>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.sellingPrice}
                </span>
                {product.mrpPrice > product.sellingPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.mrpPrice}
                  </span>
                )}
              </div>

              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {product.category?.name || "Product"}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => handleAddToCart(product)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
              <button
                onClick={() => handleAddToWishlist(product)}
                className="p-2 border border-gray-300 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-300"
              >
                <Heart size={16} className="text-gray-600 hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Grid view
    return (
      <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-80">
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

  const isUsingDummyData = !loading && error && products.length === 0;
  const paginationTotalPages = isUsingDummyData
    ? Math.ceil(filteredProducts.length / 12)
    : totalPages;

  const Pagination: React.FC = () => (
    <div className="flex items-center justify-between mt-8">
      <div className="text-gray-600">
        Showing {currentPage * 12 + 1} to{" "}
        {Math.min((currentPage + 1) * 12, filteredProducts.length)} of{" "}
        {filteredProducts.length} products
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {[...Array(paginationTotalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              currentPage === index
                ? "bg-blue-600 text-white"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage(Math.min(paginationTotalPages - 1, currentPage + 1))
          }
          disabled={currentPage >= paginationTotalPages - 1}
          className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Products</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-white shadow" : "text-gray-600"
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-white shadow" : "text-gray-600"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>

              {/* Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          min: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          max: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "space-y-6"
          }
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl mb-4">No products found</div>
            <p className="text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {filteredProducts.length > 0 && <Pagination />}
      </div>
    </div>
  );
};

export default ProductsPage;
