import { useState, useEffect, DependencyList } from 'react';
import { APIResponse } from 'types/api';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useFetch<T>(
  fetchFn: () => Promise<APIResponse<T>>,
  deps: DependencyList = [],
  initialData: T | null = null
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: initialData,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const response = await fetchFn();
        
        if (mounted && 'data' in response) {
          setState({
            data: response.data,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        if (mounted) {
          setState({
            data: null,
            isLoading: false,
            error: err instanceof Error ? err.message : 'An error occurred',
          });
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, deps);

  return state;
}
