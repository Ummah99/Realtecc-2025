import React from 'react';
import { Link } from 'react-router-dom';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  link: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  link
}) => {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <div className="hero-text">
          <span className="subtitle">{subtitle}</span>
          <h1 className="title">{title}</h1>
          <p className="description">{description}</p>
          <Link to={link} className="shop-now-btn">
            Shop Now
          </Link>
        </div>
        <div className="hero-image">
          <img src={imageUrl} alt={title} />
        </div>
      </div>
      <div className="hero-dots">
        <span className="dot active"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
};

export default HeroBanner; 