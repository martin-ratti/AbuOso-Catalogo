import { create } from 'zustand';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import type { Figure } from '../types';

interface CatalogState {
  figures: Figure[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchCatalog: () => Promise<void>;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  figures: [],
  loading: false,
  error: null,
  hasFetched: false,

  fetchCatalog: async () => {
    // Si ya los trajo, no volver a traerlos (funciona como caché global)
    if (get().hasFetched || get().loading) return;
    
    set({ loading: true, error: null });
    try {
      const q = query(collection(db, 'figures'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Figure[];

      set({ figures: data, hasFetched: true, loading: false });
    } catch (err) {
      console.error('Error fetching catalog:', err);
      set({ error: 'Ocurrió un error al cargar el catálogo.', loading: false });
    }
  }
}));
