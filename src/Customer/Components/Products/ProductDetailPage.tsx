import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/Store";
import { fetchProductById } from "../../../Services/ProductCustomer/ProductSlice";
import { addToWishList } from "../../../Services/wishlist/WushListSlice";
import { addItemToCart } from "../../../Services/cart/CartSlice";
import { CircularProgress } from "@mui/material";
import { Rating } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const handleAddToCart = () => {
    if (!jwt) {
      toast.info("Please login to add items to your cart");
      navigate("/login");
      return;
    }

    if (product) {
      const cartItem = {
        productId: product.id,
        quantity,
        size: selectedSize,
      };

      dispatch(addItemToCart({ cartItem, jwt }))
        .unwrap()
        .then(() => {
          toast.success("Product added to cart!");
        })
        .catch(() => {
          toast.error("Failed to add product to cart");
        });
    }
  };

  const handleAddToWishlist = () => {
    if (!jwt) {
      toast.info("Please login to add items to your wishlist");
      navigate("/login");
      return;
    }

    if (product) {
      dispatch(addToWishList({ productId: product.id, jwt }))
        .unwrap()
        .then(() => {
          toast.success("Product added to wishlist!");
        })
        .catch(() => {
          toast.error("Failed to add product to wishlist");
        });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Product not found
        </h2>
        <p className="text-gray-600 mb-6">
          {error || "Unable to load product details"}
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Images Section */}
          <div className="md:w-1/2 p-6">
            <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 h-96">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === image
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`${product.title} - view ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="md:w-1/2 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {product.title}
              </h1>
              <div className="flex items-center mb-4">
                <div className="mr-2">
                  <Rating
                    value={
                      product.reviews?.length
                        ? product.reviews.reduce(
                            (sum, review) => sum + review.rating,
                            0
                          ) / product.reviews.length
                        : 4.5
                    }
                    readOnly
                    precision={0.5}
                    size="small"
                  />
                </div>
                <span className="text-sm text-gray-500">
                  {product.numbsRatings || 0} reviews
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-500">SKU: {product.id}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-blue-600">
                  ${product.sellingPrice}
                </span>
                {product.mrpPrice &&
                  product.mrpPrice > product.sellingPrice && (
                    <>
                      <span className="ml-3 text-lg text-gray-400 line-through">
                        ${product.mrpPrice}
                      </span>
                      <span className="ml-3 text-sm bg-red-100 text-red-700 px-2 py-1 rounded-md">
                        {Math.round(
                          ((product.mrpPrice - product.sellingPrice) /
                            product.mrpPrice) *
                            100
                        )}
                        % off
                      </span>
                    </>
                  )}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-gray-600">{product.description}</p>
            </div>

            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 rounded-md border ${
                        selectedSize === size
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Quantity
              </h3>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className={`px-4 py-2 border border-gray-300 rounded-l-md ${
                    quantity <= 1
                      ? "bg-gray-100 text-gray-400"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 px-3 py-2 text-center border-t border-b border-gray-300 focus:outline-none"
                />
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  disabled={quantity >= product.quantity}
                  className={`px-4 py-2 border border-gray-300 rounded-r-md ${
                    quantity >= product.quantity
                      ? "bg-gray-100 text-gray-400"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                className={`flex-1 py-3 px-6 rounded-md font-medium ${
                  product.quantity < 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                }`}
                onClick={handleAddToCart}
                disabled={product.quantity < 1}
              >
                {product.quantity < 1 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                className="flex-1 py-3 px-6 bg-gray-100 text-gray-800 rounded-md font-medium hover:bg-gray-200 transition duration-300 flex items-center justify-center"
                onClick={handleAddToWishlist}
              >
                <i className="far fa-heart mr-2"></i> Add to Wishlist
              </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-800">Category:</span>
                  <span className="text-gray-600 ml-2">
                    {product.category?.name}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Brand:</span>
                  <span className="text-gray-600 ml-2">
                    {product.brand || "Generic"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
