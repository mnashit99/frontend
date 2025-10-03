import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import styles from './CategoryNav.module.css';

interface Category {
  id: string;
  name: string;
  parent?: Category | null;
  children?: Category[];
}

// Recursive component to render category menu items
const CategoryMenuItem: React.FC<{ category: Category }> = ({ category }) => {
  const hasChildren = category.children && category.children.length > 0;

  return (
    <li className={styles.navItem + (hasChildren ? ' ' + styles.hasDropdown : '')}>
      <Link to={`/category/${category.id}`}>{category.name}</Link>
      {hasChildren && (
        <ul className={styles.dropdown}>
          {category.children?.map(childCategory => (
            <CategoryMenuItem key={childCategory.id} category={childCategory} />
          ))}
        </ul>
      )}
    </li>
  );
};

const CategoryNav: React.FC = () => {
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndBuildTree = async () => {
      try {
        const response = await api.get<Category[]>('/categories');
        const categories = response.data;

        // Build the tree structure
        const categoryMap: { [key: string]: Category } = {};
        const rootCategories: Category[] = [];

        categories.forEach(category => {
          categoryMap[category.id] = { ...category, children: [] };
        });

        categories.forEach(category => {
          if (category.parent) {
            // Ensure parent exists in map before pushing
            if (categoryMap[category.parent.id]) {
              categoryMap[category.parent.id].children?.push(categoryMap[category.id]);
            }
          } else {
            rootCategories.push(categoryMap[category.id]);
          }
        });

        setCategoryTree(rootCategories);

      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndBuildTree();
  }, []);

  if (loading) {
    return <div className={styles.loadingNav}>Loading Categories...</div>;
  }

  return (
    <nav className={styles.categoryNav}>
      <ul className={styles.navList}>
        {categoryTree.map(parentCategory => (
          <CategoryMenuItem key={parentCategory.id} category={parentCategory} />
        ))}
      </ul>
    </nav>
  );

};

export default CategoryNav;
