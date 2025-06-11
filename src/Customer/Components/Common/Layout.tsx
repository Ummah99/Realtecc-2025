import React from "react";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">{children}</main>
      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} Realtecc. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="/terms"
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Terms of Service
              </a>
              <a
                href="/privacy"
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-blue-600 text-sm"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
