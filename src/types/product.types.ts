// types/product.types.ts
export interface ProductVariant {
  id: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  options?: any; // For color, size, etc.
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  thumbnail: string;
  tags: string[];
  isActive: boolean;
  category: any; // We'll refine this later
  variants: ProductVariant[];
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}