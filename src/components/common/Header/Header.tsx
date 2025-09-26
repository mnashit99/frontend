import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import useAuthStore from '../../../store/authStore';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">E-Commerce</Link>
      </div>

      <div className={styles.searchContainer}>
        <input type="text" placeholder="Search for products..." className={styles.searchInput} />
        <select className={styles.categorySelect}>
          <option>All Categories</option>
          {/* Categories will be populated from the API later */}
        </select>
        <button className={styles.searchButton}>Search</button>
      </div>

      <div className={styles.userActions}>
        {isAuthenticated ? (
          <div className={styles.profileDropdown}>
            <span>Hello, {user?.name}</span>
            <div className={styles.dropdownContent}>
              <Link to="/profile">My Profile</Link>
              <Link to="/orders">Order History</Link>
              <button onClick={logout}>Logout</button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        <Link to="/cart" className={styles.cartLink}>Cart</Link>
      </div>
    </header>
  );
};

export default Header;