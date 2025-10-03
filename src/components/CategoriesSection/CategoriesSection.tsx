import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import styles from './CategoriesSection.module.css';

interface Category {
  id: string;
  name: string;
  parent?: Category | null;
  imageUrl?: string;
}

const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get<Category[]>('/categories');
        const parentCategories = response.data.filter(cat => !cat.parent);
        setCategories(parentCategories);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className={styles.categoriesSection}>
        <h2>Shop by Category</h2>
        <div className={styles.loading}>Loading categories...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.categoriesSection}>
        <h2>Shop by Category</h2>
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

  if (categories.length === 0) {
    return (
      <section className={styles.categoriesSection}>
        <h2>Shop by Category</h2>
        <div className={styles.empty}>No categories available</div>
      </section>
    );
  }

  return (
    <section className={styles.categoriesSection}>
      <h2>Shop by Category</h2>
      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <Link 
            to={`/category/${category.id}`} 
            key={category.id} 
            className={styles.categoryCard}
          >
            <div className={styles.imageContainer}>
              <img 
                src={category.imageUrl || '/images/category-placeholder.jpg'} 
                alt={category.name} 
                className={styles.categoryImage} 
                loading="lazy"
              />
              <div className={styles.overlay}></div>
            </div>
            <div className={styles.categoryName}>
              <h3>{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;