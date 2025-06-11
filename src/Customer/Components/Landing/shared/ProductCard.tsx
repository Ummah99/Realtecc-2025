import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../Store/Store";
import { addItemToCart } from "../../../../Services/cart/CartSlice";
import { addToWishList } from "../../../../Services/wishlist/WushListSlice";
import { Product } from "../../../../types/product/ProductTypes";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { toast } from "react-toastify";

interface ProductCardProps {
  product: Product;
  size?: "normal" | "large";
  viewMode?: "grid" | "list";
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  size = "normal",
  viewMode = "grid",
  className = "",
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { jwt } = useSelector((state: RootState) => state.auth);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

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

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();

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

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const rating = product.reviews?.length
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.reviews.length
    : 4.5;

  const discount = product.discountPercentage;

  if (viewMode === "list") {
    return (
      <div
        className={`flex bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${className}`}
        onClick={handleProductClick}
      >
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
                    i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                  }
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">
                ({product.numbsRatings || 0})
              </span>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
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
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
            <button
              onClick={handleAddToWishlist}
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
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
        size === "large" ? "h-96" : "h-80"
      } ${className}`}
      onClick={handleProductClick}
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
          onClick={handleAddToWishlist}
          className="absolute top-3 left-3 p-2 rounded-full bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <Heart size={16} />
        </button>

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
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

        <h3 className="font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
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

export default ProductCard;
