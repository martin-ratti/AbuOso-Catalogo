import { create } from 'zustand';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import type { Figure } from '../types';

interface CatalogState {
  figures: Figure[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchCatalog: () => void;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  figures: [],
  loading: false,
  error: null,
  hasFetched: false,

  fetchCatalog: () => {
    // Si ya estamos suscritos, no hacer nada
    if (get().hasFetched || get().loading) return;
    
    set({ loading: true, error: null });
    
    const q = query(collection(db, 'figures'), orderBy('createdAt', 'desc'));
    
    onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Figure[];

      set({ figures: data, hasFetched: true, loading: false });
    }, (err) => {
      console.error('Error fetching catalog:', err);
      set({ error: 'Ocurrió un error al cargar el catálogo.', loading: false });
    });
  }
}));
