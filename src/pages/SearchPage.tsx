import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard/ProductCard';
import styles from './AllProductsPage.module.css'; // Reuse styles for consistency
import { Product } from '../types/product.types';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const query = useQuery().get('q');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get<Product[]>('/products/search', {
          params: { query },
        });
        setProducts(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch search results');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className={styles.pageContainer}>
      <h1>Search Results for "{query}"</h1>

      {loading && <div className={styles.loading}>Loading...</div>}
      {error && <div className={styles.error}>Error: {error}</div>}

      {!loading && !error && products.length === 0 && (
        <div>No products found matching your search.</div>
      )}

      <div className={styles.productsGrid}>
        {products.map(product => (
          <ProductCard key={product.id} product={product as any} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
