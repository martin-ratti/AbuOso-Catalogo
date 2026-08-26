import { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
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
    const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
    
    const unsubscribe = onSnapshot(q, (catSnap) => {
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
      setLoadingCats(false);
    }, (error) => {
      console.error('Error fetching categories:', error);
      setLoadingCats(false);
    });

    return () => unsubscribe();
  }, []);

  return { categories, loadingCats };
}
