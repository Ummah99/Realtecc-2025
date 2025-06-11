import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/Store";
import { fetchProductById } from "../../../Services/ProductCustomer/ProductSlice";
import { addItemToCart } from "../../../Services/cart/CartSlice";
import { addToWishList } from "../../../Services/wishlist/WushListSlice";
import { Product } from "../../../types/product/ProductTypes";
import {
  ShoppingCart,
  Heart,
  Star,
  Plus,
  Minus,
  ArrowLeft,
  Share2,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { product, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const { jwt } = useSelector((state: RootState) => state.auth);

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(parseInt(productId)));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    }
    if (product?.availableSizes && product.availableSizes.length > 0) {
      setSelectedSize(product.availableSizes[0]);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!jwt) {
      toast.info("Please login to add items to your cart");
      navigate("/customer/login");
      return;
    }

    if (product) {
      try {
        const cartItem = {
          productId: product.id,
          quantity,
          size: selectedSize,
        };

        await dispatch(addItemToCart({ cartItem, jwt })).unwrap();
        toast.success("Product added to cart!");
      } catch (error) {
        toast.error("Failed to add product to cart");
      }
    }
  };

  const handleAddToWishlist = async () => {
    if (!jwt) {
      toast.info("Please login to add items to your wishlist");
      navigate("/customer/login");
      return;
    }

    if (product) {
      try {
        await dispatch(addToWishList({ productId: product.id, jwt })).unwrap();
        toast.success("Product added to wishlist!");
      } catch (error) {
        toast.error("Failed to add product to wishlist");
      }
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Unable to load product details"}
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const rating = product.reviews?.length
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.reviews.length
    : 4.5;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Products
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{product.category?.name}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={
                    selectedImage ||
                    product.images[0] ||
                    "https://via.placeholder.com/600"
                  }
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === image
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        fill={i < Math.floor(rating) ? "#fbbf24" : "none"}
                        className={
                          i < Math.floor(rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {rating.toFixed(1)} ({product.numbsRatings || 0} reviews)
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">SKU: {product.id}</span>
                </div>

                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-4xl font-bold text-blue-600">
                    ${product.sellingPrice}
                  </span>
                  {product.mrpPrice > product.sellingPrice && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        ${product.mrpPrice}
                      </span>
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {Math.round(product.discountPercentage)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Size
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                          selectedSize === size
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-xl">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-3 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-6 py-3 text-lg font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.quantity}
                      className="p-3 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.quantity} items in stock
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantity < 1}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={20} />
                  {product.quantity < 1 ? "Out of Stock" : "Add to Cart"}
                </button>

                <button
                  onClick={handleAddToWishlist}
                  className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-300"
                >
                  <Heart size={20} className="text-gray-600" />
                  <span className="font-semibold text-gray-700">Wishlist</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                >
                  <Share2 size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Truck className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Free Shipping
                    </div>
                    <div className="text-sm text-gray-600">
                      On orders over $100
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Shield className="text-green-600" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Secure Payment
                    </div>
                    <div className="text-sm text-gray-600">100% secure</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <RefreshCw className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Easy Returns
                    </div>
                    <div className="text-sm text-gray-600">30-day policy</div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="ml-2 text-gray-600">
                      {product.category?.name}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Brand:</span>
                    <span className="ml-2 text-gray-600">
                      {product.brand || "Generic"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Color:</span>
                    <span className="ml-2 text-gray-600">{product.colour}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Size Type:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {product.sizeType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl mt-8 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Reviews
            </h2>
            <div className="space-y-6">
              {product.reviews.slice(0, 3).map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < review.rating ? "#fbbf24" : "none"}
                          className={
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.reviewText}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
