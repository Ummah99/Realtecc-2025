import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/Store";
import { fetchWishList } from "../../../Services/wishlist/WushListSlice";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { addItemToCart } from "../../../Services/cart/CartSlice";
import { toast } from "react-toastify";

const WishlistPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { wishlist, loading, error } = useSelector(
    (state: RootState) => state.wishList
  );
  const { jwt } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (jwt) {
      dispatch(fetchWishList({ jwt }));
    } else {
      navigate("/login");
    }
  }, [dispatch, jwt, navigate]);

  const handleAddToCart = (productId: number) => {
    if (!jwt) {
      toast.info("Please login to add items to your cart");
      navigate("/login");
      return;
    }

    const cartItem = {
      productId,
      quantity: 1,
      size: "",
    };

    dispatch(addItemToCart({ cartItem, jwt }))
      .unwrap()
      .then(() => {
        toast.success("Product added to cart!");
      })
      .catch(() => {
        toast.error("Failed to add product to cart");
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      </div>
    );
  }

  if (!wishlist || wishlist.wishListProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-gray-600 mb-4">Your wishlist is empty</div>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.wishListProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative">
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/300"}
                  alt={product.title}
                  className="w-full h-64 object-cover"
                />
              </Link>
            </div>

            <div className="p-4">
              <Link to={`/product/${product.id}`}>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 hover:text-blue-600">
                  {product.title}
                </h3>
              </Link>

              <div className="flex items-baseline mb-2">
                <span className="text-xl font-bold text-blue-600">
                  ${product.sellingPrice}
                </span>
                {product.mrpPrice &&
                  product.mrpPrice > product.sellingPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ${product.mrpPrice}
                    </span>
                  )}
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
                <Link
                  to={`/product/${product.id}`}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded text-center hover:bg-gray-300 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
