import React from 'react';
import ProductCard from './ProductCard';

interface ProductType {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  image: string;
  category: string;
  rating: number;
  isNew?: boolean;
  discount?: number;
}

interface FeaturedProductsProps {
  title: string;
  description?: string;
  products: ProductType[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title,
  description,
  products
}) => {
  return (
    <section className="featured-products">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            discountPrice={product.discountPrice}
            image={product.image}
            rating={product.rating}
            isNew={product.isNew}
            discount={product.discount}
          />
        ))}
      </div>
      <div className="pagination-dots">
        <span className="dot active"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </section>
  );
};

export default FeaturedProducts; 