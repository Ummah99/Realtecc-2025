import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/Store";
import {
  fetchAllProducts,
  searchProducts,
} from "../../../Services/ProductCustomer/ProductSlice";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { addToWishList } from "../../../Services/wishlist/WushListSlice";
import { toast } from "react-toastify";

const ProductListingPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, totalPages } = useSelector(
    (state: RootState) => state.product
  );
  const { jwt } = useSelector((state: RootState) => state.auth);

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    loadProducts();
  }, [currentPage, sortBy, category]);

  const loadProducts = () => {
    const params: Record<string, any> = {
      page: currentPage,
      size: 12,
    };

    if (sortBy) {
      params.sort = sortBy;
    }

    if (category) {
      params.category = category;
    }

    dispatch(fetchAllProducts(params));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchProducts({ query: searchTerm }));
    } else {
      loadProducts();
    }
  };

  const handleAddToWishlist = (productId: number) => {
    if (!jwt) {
      toast.info("Please login to add items to your wishlist");
      return;
    }

    dispatch(addToWishList({ productId, jwt }))
      .unwrap()
      .then(() => {
        toast.success("Product added to wishlist!");
      })
      .catch(() => {
        toast.error("Failed to add product to wishlist");
      });
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border border-blue-600"
          }`}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Products</h1>

        {/* Search and filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <form
            onSubmit={handleSearch}
            className="flex w-full md:w-1/2 mb-4 md:mb-0"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          <div className="flex space-x-4 w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none"
            >
              <option value="">Sort By</option>
              <option value="sellingPrice,asc">Price: Low to High</option>
              <option value="sellingPrice,desc">Price: High to Low</option>
              <option value="rating,desc">Highest Rated</option>
              <option value="createdAt,desc">Newest</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home & Kitchen</option>
              <option value="beauty">Beauty</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <Link to={`/product/${product.id}`}>
              <div className="h-64 overflow-hidden">
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/300"}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </Link>

            <div className="p-4">
              <Link to={`/product/${product.id}`}>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 hover:text-blue-600 truncate">
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

              <div className="flex items-center justify-between mt-4">
                <Link
                  to={`/product/${product.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleAddToWishlist(product.id)}
                  className="p-2 text-gray-500 hover:text-red-500"
                  aria-label="Add to wishlist"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 rounded bg-white text-blue-600 border border-blue-600 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="mx-2">{renderPagination()}</div>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 rounded bg-white text-blue-600 border border-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
