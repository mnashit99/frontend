import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import CategoryNav from '../components/common/CategoryNav/CategoryNav';
import ProductCard from '../components/common/ProductCard/ProductCard';
import useProducts from '../hooks/useProducts';
import { Product } from '../types/product.types';
import styles from './CategoryPage.module.css';

interface Category {
  id: string;
  name: string;
}

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading, error } = useProducts({ categoryId: id });
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      try {
        const response = await api.get<Category>(`/categories/${id}`);
        setCategory(response.data);
      } catch (err) {
        console.error('Failed to fetch category:', err);
      }
    };

    fetchCategory();
  }, [id]);

  return (
    <div>
      <CategoryNav />
      <div className={styles.pageContainer}>
        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>Error: {error}</div>}
        {!loading && !error && (
          <>
            <h1 className={styles.categoryTitle}>{category?.name || 'Products'}</h1>
            {products.length > 0 ? (
              <div className={styles.productsGrid}>
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product as Product} // ✅ TYPE ASSERTION
                  />
                ))}
              </div>
            ) : (
              <p>No products found in this category.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;