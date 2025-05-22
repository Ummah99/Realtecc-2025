import React from 'react';
import { Link } from 'react-router-dom';

interface PromoCardProps {
  title: string;
  subtitle?: string;
  image: string;
  link: string;
}

const PromoCard: React.FC<PromoCardProps> = ({
  title,
  subtitle,
  image,
  link
}) => {
  return (
    <div className="promo-card">
      <div className="promo-image">
        <img src={image} alt={title} />
      </div>
      <div className="promo-content">
        {subtitle && <span className="promo-subtitle">{subtitle}</span>}
        <h3 className="promo-title">{title}</h3>
        <Link to={link} className="promo-link">
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default PromoCard; 