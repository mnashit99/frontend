import React from 'react';
import HeroSection from '../components/HeroSection/HeroSection';
import CategoriesSection from '../components/CategoriesSection/CategoriesSection';

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      {/* We will add more content here later, like featured products */}
    </div>
  );
};

export default HomePage;