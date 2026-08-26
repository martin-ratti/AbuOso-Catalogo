import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

export interface CatData {
  name: string;
  imageUrl?: string;
  iconName?: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<CatData[]>([
    { name: 'Todos', iconName: 'LayoutGrid' },
    { name: 'Nuevos', iconName: 'Sparkles' }
  ]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
        const catSnap = await getDocs(q);
        const catData = catSnap.docs.map(doc => ({
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
          iconName: doc.data().iconName
        }));
        
        setCategories([
          { name: 'Todos', iconName: 'LayoutGrid' }, 
          { name: 'Nuevos', iconName: 'Sparkles' }, 
          ...catData
        ]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCats(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loadingCats };
}
