
import { useState, useEffect } from 'react';
import api from '../services/api';

interface Product {
  id: string;
  name: string;
  thumbnail?: string;
  variants: { price: number }[];
}

interface UseProductsParams {
  categoryId?: string;
  page?: number;
  limit?: number;
}

const useProducts = ({ categoryId, page = 1, limit = 20 }: UseProductsParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/products', { params: { categoryId, page, limit } });
        setProducts(prev => (page === 1 ? response.data.data : [...prev, ...response.data.data]));
        setHasMore(response.data.data.length > 0);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, page, limit]);

  return { products, loading, error, hasMore };
};

export default useProducts;
