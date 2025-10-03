import React from 'react';
import HeroSection from '../components/HeroSection/HeroSection';
import CategoriesSection from '../components/CategoriesSection/CategoriesSection';
import FeaturedProducts from '../components/FeaturedProducts/FeaturedProducts';

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      {/* We will add more content here later, like featured products */}
    </div>
  );
};

export default HomePage;