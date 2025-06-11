import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
// Seller Components
import SellerLogin from "./Seller/SellerRegistration/Login";
import SellerRegister from "./Seller/SellerRegistration/Register";
import Dashboard from "./Seller/Dashboard/Dashboard";
// Customer Components
import CustomerLogin from "./Customer/AuthComponents/LoginPage/Login";
import CustomerRegister from "./Customer/AuthComponents/RegisterPage/Register";
import OldHomepage from "./Customer/HomePage/homepage";
import Header from "./Customer/Components/Common/Header";
// Landing Components
import HomePage from "./Customer/Components/Landing/HomePage";
import ProductsPage from "./Customer/Components/Landing/ProductsPage";
import ProductDetailPage from "./Customer/Components/Landing/ProductDetailPage";
import CartPage from "./Customer/Components/Landing/CartPage";
// Existing Customer Components
import WishlistPage from "./Customer/Components/Wishlist/WishlistPage";
import OrdersPage from "./Customer/Components/Orders/OrdersPage";
import ChatPage from "./Customer/Components/Chat/ChatPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout component for customer pages
const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-right" autoClose={5000} />
        <Routes>
          {/* Main Customer Routes with Layout */}
          <Route
            path="/"
            element={
              <CustomerLayout>
                <HomePage />
              </CustomerLayout>
            }
          />

          <Route
            path="/products"
            element={
              <CustomerLayout>
                <ProductsPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/product/:productId"
            element={
              <CustomerLayout>
                <ProductDetailPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/cart"
            element={
              <CustomerLayout>
                <CartPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/wishlist"
            element={
              <CustomerLayout>
                <WishlistPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/orders"
            element={
              <CustomerLayout>
                <OrdersPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/order/:orderId"
            element={
              <CustomerLayout>
                <OrdersPage />
              </CustomerLayout>
            }
          />

          <Route
            path="/chat"
            element={
              <CustomerLayout>
                <ChatPage />
              </CustomerLayout>
            }
          />

          {/* Legacy home page */}
          <Route path="/old-home" element={<OldHomepage />} />

          {/* Customer Auth Routes (without header) */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/register" element={<CustomerRegister />} />

          {/* Seller Auth Routes */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          <Route path="/seller/dashboard/*" element={<Dashboard />} />

          {/* Legacy routes - redirecting to customer auth */}
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/register" element={<CustomerRegister />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
