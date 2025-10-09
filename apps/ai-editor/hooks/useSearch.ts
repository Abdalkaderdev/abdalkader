import { useState, useEffect, useCallback } from 'react';
import { Experiment } from '../data/experimentsData';

interface SearchFilters {
  category: string;
  difficulty: string;
  status: string;
}

interface SearchResult {
  results: Experiment[];
  total: number;
  query: string;
  filters: SearchFilters;
}

interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  defaultFilters?: Partial<SearchFilters>;
}

export function useSearch(options: UseSearchOptions = {}) {
  const {
    debounceMs = 300,
    minQueryLength = 0,
    defaultFilters = {}
  } = options;

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    difficulty: 'all',
    status: 'all',
    ...defaultFilters
  });
  
  const [results, setResults] = useState<SearchResult>({
    results: [],
    total: 0,
    query: '',
    filters: filters
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchQuery: string, searchFilters: SearchFilters) => {
    if (searchQuery.length < minQueryLength) {
      setResults({
        results: [],
        total: 0,
        query: searchQuery,
        filters: searchFilters
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        category: searchFilters.category,
        difficulty: searchFilters.difficulty,
        status: searchFilters.status,
        limit: '50'
      });

      const response = await fetch(`/api/search?${params}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [minQueryLength]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(query, filters);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, filters, search, debounceMs]);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters({
      category: 'all',
      difficulty: 'all',
      status: 'all',
      ...defaultFilters
    });
    setError(null);
  }, [defaultFilters]);

  return {
    query,
    filters,
    results,
    isLoading,
    error,
    updateQuery,
    updateFilters,
    clearSearch,
    search: (searchQuery: string, searchFilters?: Partial<SearchFilters>) => 
      search(searchQuery, { ...filters, ...searchFilters })
  };
}