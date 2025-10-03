import React, { useEffect, useState } from 'react';
import api from '../services/api';
import CategoryNav from '../components/common/CategoryNav/CategoryNav';
import ProductCard from '../components/common/ProductCard/ProductCard';
import styles from './AllProductsPage.module.css';
import { Product, ProductVariant, ProductsResponse } from '../types/product.types';

// Create a variant-based product interface for display
interface VariantProduct {
  id: string; // Use PRODUCT ID for proper linking
  variantId: string; // Store variant ID separately for unique keys and URL params
  name: string; // Variant-specific name
  thumbnail: string;
  variants: ProductVariant[]; // Single variant in array
  brand?: string;
  isActive?: boolean;
}

const AllProductsPage: React.FC = () => {
  const [variantProducts, setVariantProducts] = useState<VariantProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<ProductsResponse>('/products', { 
          params: { page, limit: 20 } 
        });
        
        const productsData = response.data.data || response.data;
        
        if (Array.isArray(productsData)) {
          const uniqueVariants = new Set();
          const variantsForDisplay: VariantProduct[] = [];
          
          productsData.forEach(product => {
            if (product.variants && product.variants.length > 0) {
              product.variants.forEach(variant => {
                const variantKey = `${product.id}-${variant.id}`;
                if (uniqueVariants.has(variantKey)) return;
                uniqueVariants.add(variantKey);
                
                const variantName = getVariantDisplayName(product.name, variant);
                
                variantsForDisplay.push({
                  id: product.id,
                  variantId: variant.id, // ✅ Store the actual variant ID
                  name: variantName,
                  thumbnail: getVariantThumbnail(product.thumbnail, variant),
                  variants: [variant],
                  brand: product.brand,
                  isActive: variant.isActive && product.isActive
                });
              });
            } else {
              const productKey = `${product.id}-no-variant`;
              if (uniqueVariants.has(productKey)) return;
              uniqueVariants.add(productKey);
              
              variantsForDisplay.push({
                id: product.id,
                variantId: product.id,
                name: product.name,
                thumbnail: product.thumbnail,
                variants: [],
                brand: product.brand,
                isActive: product.isActive
              });
            }
          });
          
          setVariantProducts(prev => page === 1 ? variantsForDisplay : [...prev, ...variantsForDisplay]);
          setHasMore(productsData.length > 0);
        } else {
          console.error('Unexpected API response format:', response.data);
          setError('Unexpected data format received');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  // Helper function to create display name for variant
  const getVariantDisplayName = (productName: string, variant: ProductVariant): string => {
    if (variant.options) {
      const optionParts = [];
      
      if (variant.options.color) optionParts.push(variant.options.color);
      if (variant.options.size) optionParts.push(variant.options.size);
      if (variant.options.storage) optionParts.push(variant.options.storage);
      if (variant.options.material) optionParts.push(variant.options.material);
      
      if (optionParts.length > 0) {
        return `${productName} - ${optionParts.join(', ')}`;
      }
    }
    
    if (variant.description && variant.description !== productName) {
      return `${productName} - ${variant.description}`;
    }
    if (variant.sku) {
      return `${productName} - ${variant.sku}`;
    }
    
    return productName;
  };

  // Helper function to get variant-specific thumbnail
  const getVariantThumbnail = (productThumbnail: string, variant: ProductVariant): string => {
    return variant.images?.[0] || productThumbnail;
  };

  return (
    <div>
      <CategoryNav />
      <div className={styles.pageContainer}>
        <h1>All Products</h1>
        
        {variantProducts.length > 0 && (
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
            Showing {variantProducts.length} product variants
          </div>
        )}
        
        <div className={styles.productsGrid}>
          {variantProducts.map(variantProduct => (
            <ProductCard 
              key={`${variantProduct.id}-${variantProduct.variantId}`} 
              product={{
                id: variantProduct.id,
                name: variantProduct.name,
                thumbnail: variantProduct.thumbnail,
                variants: variantProduct.variants,
                brand: variantProduct.brand,
                isActive: variantProduct.isActive,
                variantId: variantProduct.variantId, // ✅ Pass variantId to ProductCard
              } as any} 
            />
          ))}
        </div>
        
        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>Error: {error}</div>}
        {!loading && hasMore && (
          <div className={styles.loadMoreContainer}>
            <button onClick={() => setPage(prev => prev + 1)} className={styles.loadMoreButton}>
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProductsPage;