import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mainCategory } from '../../../data/category/MainCtegory';

const Header: React.FC = () => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="welcome-text">Realtecc store</div>
        <div className="header-top-right">
          <button className="compare-btn">
            <span className="circle">0</span> Compare
          </button>
          <button className="wishlist-btn">
            <span className="circle">0</span> Wishlist
          </button>
          <div className="settings-dropdown">
            <span className="settings">Setting</span>
            <div className="dropdown-content">
              <Link to="/account">My Account</Link>
              <Link to="/orders">My Orders</Link>
              <Link to="/settings">Settings</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="header-bottom">
        <div className="categories-container">
          <button 
            className="categories-btn"
            onClick={toggleCategoryDropdown}
          >
            <i className="fas fa-bars"></i> All Categories
          </button>
          
          {showCategoryDropdown && (
            <div className="categories-dropdown">
              <ul>
                {mainCategory.map((category, index) => (
                  <li key={index} className="category-item">
                    <Link to={`/category/${category.categoryId}`}>
                      {category.name}
                    </Link>
                    {category.levelTwoCategory && category.levelTwoCategory.length > 0 && (
                      <div className="subcategories-dropdown">
                        <div className="subcategories-columns">
                          {category.levelTwoCategory.map((subCategory, subIndex) => (
                            <div className="subcategory-column" key={subIndex}>
                              <h4>
                                <Link to={`/category/${subCategory.categoryId}`}>
                                  {subCategory.name}
                                </Link>
                              </h4>
                              {subCategory.subCategories && (
                                <ul className="subcategory-items">
                                  {subCategory.subCategories.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                      <Link to={`/category/${item.categoryId}`}>
                                        {item.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="search-bar">
          <input type="text" placeholder="Enter your search key..." />
          <select>
            <option value="">All categories</option>
            {mainCategory.map((category, index) => (
              <option key={index} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
          <button className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>
        
        <div className="cart">
          <i className="fas fa-shopping-cart"></i>
          <div className="cart-info">
            <span className="cart-count">0</span>
            <span className="cart-price">$0.00</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
