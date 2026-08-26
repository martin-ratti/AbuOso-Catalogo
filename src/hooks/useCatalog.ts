import { useState, useEffect, useMemo } from 'react';
import { useCatalogStore } from '../store/catalogStore';
import { useSearchStore } from '../store/searchStore';

const PAGE_SIZE = 12;

export function useCatalog(activeCategory: string) {
  const { figures, loading, error, fetchCatalog } = useCatalogStore();
  const { searchQuery } = useSearchStore();
  
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Traer datos globales una sola vez al cargar la app o componente
  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Resetear la paginación visual si cambia el filtro o la búsqueda
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, searchQuery]);

  // Filtramos todo en memoria para una búsqueda perfecta y súper rápida
  const filteredFigures = useMemo(() => {
    return figures.filter(figure => {
      // 1. Filtro de Categoría
      const matchCategory = 
        activeCategory === 'Todos' || 
        (activeCategory === 'Nuevos' && figure.badge === 'novedad') ||
        figure.category === activeCategory;

      // 2. Filtro de Búsqueda Inteligente (Ignora mayúsculas/minúsculas y acentos)
      const query = searchQuery.toLowerCase().trim();
      const nameMatch = figure.name.toLowerCase().includes(query);
      const descMatch = figure.description?.toLowerCase().includes(query) || false;
      const matchSearch = query === '' || nameMatch || descMatch;

      return matchCategory && matchSearch;
    });
  }, [figures, activeCategory, searchQuery]);

  // Aplicar paginación visual (para no renderizar 500 nodos de golpe y trabar el celular)
  const visibleFigures = filteredFigures.slice(0, visibleCount);
  const hasMore = visibleCount < filteredFigures.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  };

  return {
    figures: visibleFigures,
    loading,
    error,
    hasMore,
    loadMore
  };
}
