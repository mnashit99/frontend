import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import styles from './FeaturedProducts.module.css';
import ProductCard from '../common/ProductCard/ProductCard';
import { Product, ProductsResponse } from '../../types/product.types';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get<ProductsResponse>('/products', { 
          params: { 
            limit: 8,
            page: 1
          } 
        });
        setProducts(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className={styles.featuredSection}>
        <h2>Featured Products</h2>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          Loading products...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.featuredSection}>
        <h2>Featured Products</h2>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className={styles.featuredSection}>
        <h2>Featured Products</h2>
        <div className={styles.empty}>No products available</div>
      </section>
    );
  }

  return (
    <section className={styles.featuredSection}>
      <h2>Featured Products</h2>
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className={styles.showAllContainer}>
        <Link to="/products" className={styles.showAllButton}>
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;