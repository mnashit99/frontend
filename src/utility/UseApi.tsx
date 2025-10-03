import { useState, useCallback } from 'react';
import api from '../services/api';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  execute: (payload?: any) => Promise<void>;
  reset: () => void;
}

// Generic API hook for consistent API calls
const useApi = <T = any>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const execute = useCallback(async (payload?: any) => {
    setIsLoading(true);
    setError(null);

    try {
      let response;
      switch (method) {
        case 'get':
          response = await api.get(url);
          break;
        case 'post':
          response = await api.post(url, payload);
          break;
        case 'put':
          response = await api.put(url, payload);
          break;
        case 'patch':
          response = await api.patch(url, payload);
          break;
        case 'delete':
          response = await api.delete(url);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setData(response.data);
      options.onSuccess?.(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMessage);
      options.onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }, [method, url, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
};

export default useApi;