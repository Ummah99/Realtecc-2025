import React from 'react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  rating: number;
  isNew?: boolean;
  discount?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  discountPrice,
  image,
  rating,
  isNew = false,
  discount
}) => {
  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star-${i}`} className="fas fa-star"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half-star" className="fas fa-star-half-alt"></i>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-star-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <div className="product-card">
      {isNew && <span className="new-badge">New</span>}
      {discount && <span className="discount-badge">-{discount}%</span>}
      <div className="product-image">
        <img src={image} alt={name} />
        <div className="product-actions">
          <button className="action-btn" title="Add to cart">
            <i className="fas fa-shopping-cart"></i>
          </button>
          <button className="action-btn" title="Add to wishlist">
            <i className="fas fa-heart"></i>
          </button>
          <button className="action-btn" title="Quick view">
            <i className="fas fa-eye"></i>
          </button>
          <button className="action-btn" title="Compare">
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
      <div className="product-info">
        <div className="rating">{renderStars(rating)}</div>
        <h3 className="product-name">
          <Link to={`/product/${id}`}>{name}</Link>
        </h3>
        <div className="product-price">
          {discountPrice ? (
            <>
              <span className="original-price">${price.toFixed(2)}</span>
              <span className="discount-price">${discountPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="current-price">${price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 