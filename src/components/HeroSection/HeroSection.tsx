import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HeroSection.module.css';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/products');
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Welcome to Our E-Commerce Store</h1>
        <p className={styles.heroSubtitle}>Discover amazing products at unbeatable prices.</p>
        <button 
          className={styles.shopNowButton}
          onClick={handleShopNow}
          aria-label="Shop Now"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;