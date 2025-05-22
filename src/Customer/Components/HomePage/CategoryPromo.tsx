import React from 'react';
import PromoCard from './PromoCard';
import { HomeCategory } from '../../../types/HomeCategory';

interface CategoryPromoProps {
  categories: HomeCategory[];
}

const CategoryPromo: React.FC<CategoryPromoProps> = ({ categories }) => {
  return (
    <section className="category-promo">
      <div className="promo-grid">
        {categories.map((category, index) => (
          <PromoCard
            key={index}
            title={category.name}
            image={category.image}
            subtitle={category.description}
            link={`/category/${category.categoryId}`}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryPromo; 