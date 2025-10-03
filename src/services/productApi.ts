// services/productApi.ts
import { Product, ProductsResponse } from '../types/product.types';
import api from './api';


export const productApi = {
  // Get all products with pagination and filters
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
  }): Promise<ProductsResponse> => {
    const response = await api.get<ProductsResponse>('/products', { params });
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },
};

export default productApi;