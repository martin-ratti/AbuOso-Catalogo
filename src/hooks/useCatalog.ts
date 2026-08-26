import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, limit, startAfter, getDocs, where, QueryConstraint } from 'firebase/firestore';
import { db } from '../firebase';
import type { Figure } from '../types';
import { useSearchStore } from '../store/searchStore';

const PAGE_SIZE = 12;

export function useCatalog(activeCategory: string) {
  const [figures, setFigures] = useState<Figure[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Guardamos el último documento de la página actual para poder pedir los siguientes
  const [lastDoc, setLastDoc] = useState<any>(null);

  const { searchQuery } = useSearchStore();

  const fetchFigures = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const constraints: QueryConstraint[] = [];
      
      // Filtro de categoría
      if (activeCategory !== 'Todos' && activeCategory !== 'Nuevos') {
        constraints.push(where('category', '==', activeCategory));
      }

      // Filtro de búsqueda (Búsqueda básica por prefijo en Firebase)
      if (searchQuery) {
        // Firebase no tiene Full Text Search nativo. 
        // Usamos un truco de prefijo buscando desde el término hasta el término + caracter muy alto.
        // REQUIRES orderBy('name') to match the inequality field.
        const formattedQuery = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1);
        
        constraints.push(
          where('name', '>=', formattedQuery),
          where('name', '<=', formattedQuery + '\uf8ff'),
          orderBy('name', 'asc')
        );
      } else {
        // Si no hay búsqueda, ordenamos por los más nuevos
        constraints.push(orderBy('createdAt', 'desc'));
      }

      // Paginación
      constraints.push(limit(PAGE_SIZE));
      if (isLoadMore && lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      const q = query(collection(db, 'figures'), ...constraints);
      const snapshot = await getDocs(q);
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Figure[];

      if (isLoadMore) {
        setFigures(prev => [...prev, ...data]);
      } else {
        setFigures(data);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === PAGE_SIZE);

    } catch (err) {
      console.error('Error fetching catalog:', err);
      setError('Ocurrió un error al cargar el catálogo.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, searchQuery, lastDoc]);

  // Refetch cuando cambia categoría o búsqueda
  useEffect(() => {
    setLastDoc(null);
    setHasMore(true);
    fetchFigures(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, searchQuery]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchFigures(true);
    }
  };

  return {
    figures,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore
  };
}
