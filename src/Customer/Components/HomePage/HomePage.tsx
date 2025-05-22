import React, { useEffect, useState } from 'react';
import HeroBanner from './HeroBanner';
import FeaturedProducts from './FeaturedProducts';
import CategoryPromo from './CategoryPromo';
import PromoCard from './PromoCard';
import { homeCategories } from '../../../data/HomeCategories';
import { featuredProducts, newProducts, dealProducts } from '../../../data/FeaturedProducts';
import { HomeCategory, HomeData } from '../../../types/HomeCategory';
import { Deal } from '../../../types/DealTypes';
import './HomePage.css';
import Header from './Header';

const HomePage: React.FC = () => {
  const [homeData, setHomeData] = useState<HomeData>({
    grid: [],
    shopByCategory: [],
    electricCategories: [],
    deals: [],
    dealCategories: []
  });

  useEffect(() => {
    // Filter categories by section
    const gridCategories = homeCategories.filter(cat => cat.homeSection === 'GRID');
    const shopByCategories = homeCategories.filter(cat => cat.homeSection === 'SHOP_BY_CATEGORY');
    const electricCategories = homeCategories.filter(cat => cat.homeSection === 'ELECTRIC_CATEGORY');
    const dealCategories = homeCategories.filter(cat => cat.homeSection === 'DEALS');

    // Create Deal objects from dealProducts
    const deals: Deal[] = dealProducts.map(deal => ({
      id: deal.id,
      discount: deal.discount || 0,
      category: {
        id: undefined,
        name: deal.name,
        categoryId: deal.category,
        image: deal.image,
        description: deal.description || '',
        homeSection: 'DEALS'
      }
    }));

    setHomeData({
      grid: gridCategories,
      shopByCategory: shopByCategories,
      electricCategories: electricCategories,
      deals: deals,
      dealCategories: dealCategories
    });
  }, []);

  return (
    <div className="homepage">
      <Header />
      
      {/* Hero Banner Section */}
      <HeroBanner
        title="Logitech Wireless Gamepad F710"
        subtitle="2.4G WIRELESS GAMEPAD"
        description="Wireless Nintendo DS, Play TV-In Box"
        imageUrl={featuredProducts[0].image}
        link={`/product/${featuredProducts[0].id}`}
      />
      
      {/* Featured Products Section */}
      <FeaturedProducts
        title="Featured Products"
        description="Add featured products to weekly line up"
        products={featuredProducts}
      />
      
      {/* Category Promo Grid */}
      <section className="promo-section">
        <div className="promo-row">
          <div className="promo-col left">
            <PromoCard
              title="Apple Watch"
              subtitle="The New"
              image="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT553_VW_34FR+watch-49-titanium-ultra2_VW_34FR_WF_CO+watch-face-49-alpine-ultra2_VW_34FR_WF_CO?wid=700&hei=700&trim=1%2C0&fmt=p-jpg&qlt=95&.v=1693598491372"
              link="/category/wearables"
            />
          </div>
          <div className="promo-col center">
            <PromoCard
              title="H2 Sport Earbuds"
              subtitle=""
              image="https://m.media-amazon.com/images/I/61pzM+xRvdL._AC_UF1000,1000_QL80_.jpg"
              link="/category/audio"
            />
          </div>
          <div className="promo-col right">
            <PromoCard
              title="Mini Speaker"
              subtitle="Beats Pill"
              image="https://media.wired.com/photos/5926db217034dc5f91bed4e6/master/w_2560%2Cc_limit/Beats-Pill-Plus-ft.jpg"
              link="/category/audio"
            />
          </div>
        </div>
      </section>
      
      {/* New Products Section */}
      <FeaturedProducts
        title="New Products"
        products={newProducts}
      />
      
      {/* Electronics Categories Section */}
      <section className="section-title-container">
        <h2 className="section-title">Electronics Categories</h2>
        <CategoryPromo categories={homeData.electricCategories} />
      </section>
      
      {/* Deals Section */}
      <FeaturedProducts
        title="Best Deals"
        description="Up to 70% Off"
        products={dealProducts}
      />
      
      {/* Footer Navigation */}
      <section className="footer-nav">
        <div className="footer-nav-item">
          <i className="fas fa-truck"></i>
          <h4>Free Shipping</h4>
          <p>On all orders over $75.00</p>
        </div>
        <div className="footer-nav-item">
          <i className="fas fa-undo"></i>
          <h4>Free Returns</h4>
          <p>Returns within 7 days</p>
        </div>
        <div className="footer-nav-item">
          <i className="fas fa-lock"></i>
          <h4>Secure Shopping</h4>
          <p>Your payment is secure</p>
        </div>
        <div className="footer-nav-item">
          <i className="fas fa-box"></i>
          <h4>100% Original</h4>
          <p>Original products guaranteed</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 