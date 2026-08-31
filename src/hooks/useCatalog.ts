import { useState, useEffect, useMemo } from 'react';
import { useCatalogStore } from '../store/catalogStore';
import { useSearchStore } from '../store/searchStore';

const PAGE_SIZE = 12;

export function useCatalog(activeCategory: string) {
  const { figures, loading, error, fetchCatalog } = useCatalogStore();
  const { searchQuery } = useSearchStore();
  
  const [prevFilter, setPrevFilter] = useState({ activeCategory, searchQuery });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (prevFilter.activeCategory !== activeCategory || prevFilter.searchQuery !== searchQuery) {
    setPrevFilter({ activeCategory, searchQuery });
    setVisibleCount(PAGE_SIZE);
  }

  // Traer datos globales una sola vez al cargar la app o componente
  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Filtramos todo en memoria para una búsqueda perfecta, instantánea e insensible a mayúsculas/acentos
  const filteredFigures = useMemo(() => {
    const normalize = (str: string) => 
      str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const query = normalize(searchQuery);

    return figures.filter(figure => {
      // 1. Filtro de Categoría
      const matchCategory = 
        activeCategory === 'Todos' || 
        (activeCategory === 'Novedades' && figure.badge === 'novedad') ||
        figure.category === activeCategory;

      // 2. Filtro de Búsqueda Inteligente (Ignora mayúsculas/minúsculas y acentos)
      const nameMatch = normalize(figure.name).includes(query);
      const descMatch = figure.description ? normalize(figure.description).includes(query) : false;
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
