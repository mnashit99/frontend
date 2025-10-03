import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSections}>
          {/* Company Info */}
          <div className={styles.footerSection}>
            <h3>🛍️ E-Commerce</h3>
            <p>Your trusted online shopping destination for quality products at unbeatable prices.</p>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className={styles.footerSection}>
            <h4>Customer Service</h4>
            <ul>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
              <li><Link to="/track-order">Track Order</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div className={styles.footerSection}>
            <h4>Policies</h4>
            <ul>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.footerBottom}>
          <p>&copy; {currentYear} E-Commerce. All rights reserved.</p>
          <div className={styles.paymentMethods}>
            <span>We accept: 💳 🅰️ 🅱️ 📱</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;