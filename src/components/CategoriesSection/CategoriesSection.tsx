import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from './CategoriesSection.module.css';

interface Category {
  id: string;
  name: string;
  // Add other category properties if available from backend
}

const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<Category[]>('/categories');
        setCategories(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading categories...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <section className={styles.categoriesSection}>
      <h2>Shop by Category</h2>
      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <div key={category.id} className={styles.categoryCard}>
            <h3>{category.name}</h3>
            {/* Add category image or description here if available */}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
