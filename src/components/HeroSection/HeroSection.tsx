import React from 'react';
import styles from './HeroSection.module.css';

const HeroSection: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>Welcome to Our E-Commerce Store</h1>
        <p>Discover amazing products at unbeatable prices.</p>
        <button className={styles.shopNowButton}>Shop Now</button>
      </div>
    </section>
  );
};

export default HeroSection;
