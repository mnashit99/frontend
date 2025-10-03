import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Product } from '../types/product.types';
import productApi from '../services/productApi';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // MINIMAL STATE - only what we need
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get selected variant from URL or use first variant
  const selectedVariantId = searchParams.get('variant');
  const selectedVariant = product?.variants.find(v => v.id === selectedVariantId) || product?.variants[0];

  // SINGLE useEffect - no dependencies that cause loops
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const productData = await productApi.getProductById(id);
        setProduct(productData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Only depends on id - safe!

  // Safe variant change handler - updates URL only
  const handleVariantChange = (variantId: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('variant', variantId);
    setSearchParams(newSearchParams);
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    console.log('Add to Cart:', {
      productId: product?.id,
      variantId: selectedVariant.id,
      variantName: selectedVariant.description,
      price: selectedVariant.price
    });
    
    // TODO: Implement add to cart functionality
    alert('Added to cart! This will be implemented with cart functionality.');
  };

  // Handle Buy Now - Direct checkout
  const handleBuyNow = () => {
    if (!selectedVariant) return;
    
    console.log('Buy Now:', {
      productId: product?.id,
      variantId: selectedVariant.id,
      variantName: selectedVariant.description,
      price: selectedVariant.price,
      quantity: 1
    });
    
    // TODO: Implement direct checkout/buy now functionality
    alert('Proceeding to checkout! This will be implemented with checkout flow.');
    
    // This will navigate to checkout page with this variant pre-selected
    // navigate('/checkout', { state: { buyNowVariant: selectedVariant } });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className={styles.productDetailPage}>
      <div className={styles.productContainer}>
        
        {/* Product Images */}
        <div className={styles.imageSection}>
          {selectedVariant?.images?.[0] ? (
            <img 
              src={selectedVariant.images[0]} 
              alt={product.name}
              className={styles.mainImage}
            />
          ) : (
            <div className={styles.placeholderImage}>
              📦 No Image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={styles.infoSection}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.brand}>by {product.brand}</p>
          
          {/* Variant Selection */}
          {product.variants.length > 1 && (
            <div className={styles.variantSection}>
              <h3>Select Variant:</h3>
              <div className={styles.variantButtons}>
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantChange(variant.id)}
                    className={`${styles.variantButton} ${
                      selectedVariant?.id === variant.id ? styles.active : ''
                    }`}
                  >
                    {variant.options?.color || variant.options?.size || variant.sku}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Variant Details */}
          {selectedVariant && (
            <div className={styles.variantDetails}>
              <div className={styles.priceSection}>
                <span className={styles.price}>${selectedVariant.price}</span>
                <span className={styles.stock}>
                  {selectedVariant.stock > 0 ? 
                    `${selectedVariant.stock} in stock` : 
                    'Out of stock'
                  }
                </span>
              </div>
              
              <p className={styles.variantDescription}>
                {selectedVariant.description}
              </p>

              {/* ✅ UPDATED: Action Buttons - Buy Now & Add to Cart */}
              <div className={styles.actionButtons}>
                <button 
                  className={styles.buyNowButton}
                  onClick={handleBuyNow}
                  disabled={selectedVariant.stock === 0}
                >
                  🚀 Buy Now
                </button>
                
                <button 
                  className={styles.addToCartButton}
                  //onClick={handleAddToCart}
                  disabled={selectedVariant.stock === 0}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;