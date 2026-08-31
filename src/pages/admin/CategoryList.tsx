import { useState, useEffect } from 'react';
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit, Plus, Loader2, Tags } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { ConfirmModal } from '../../components/ConfirmModal';

export function CategoryList() {
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore(s => s.addToast);
  
  // Estado para el modal de confirmación
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
      setCategories(data);
      setLoading(false);
    }, () => {
      addToast('Error al cargar categorías', 'error');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [addToast]);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, 'categories', itemToDelete));
      addToast('Categoría eliminada', 'success');
      setCategories(categories.filter(c => c.id !== itemToDelete));
    } catch {
      addToast('Error al eliminar', 'error');
    }
    setItemToDelete(null);
  };

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full px-3 sm:px-4 py-5 sm:py-8 flex flex-col">
      <ConfirmModal 
        isOpen={itemToDelete !== null}
        title="Eliminar categoría"
        message="¿Estás seguro que deseas eliminar esta categoría? Esta acción no se puede deshacer."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />

      <div className="mb-4 sm:mb-6 flex justify-between items-center">
        <Link to="/admin/dashboard" className="text-abu-brown hover:text-abu-accent flex items-center gap-2 font-medium text-sm sm:text-base">
          <ArrowLeft size={18} /> Volver
        </Link>
        <Link to="/admin/categories/new" className="bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 sm:gap-2 font-bold hover:bg-purple-700 transition-all active:scale-95 text-sm sm:text-base hover:shadow-md">
          <Plus size={18} /> Nueva
        </Link>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-abu-cream p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-abu-brown mb-4 sm:mb-6 flex items-center gap-2">
          <Tags className="text-purple-600" size={24} /> Categorías
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-abu-accent" size={32} /></div>
        ) : (
          <div className="divide-y divide-abu-cream">
            {categories.map(cat => (
              <div key={cat.id} className="py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
                <span className="font-bold text-abu-dark text-base sm:text-lg truncate">{cat.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <Link to={`/admin/categories/edit/${cat.id}`} className="p-2 sm:p-2.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors active:scale-95">
                    <Edit size={18} className="sm:w-5 sm:h-5" />
                  </Link>
                  <button onClick={() => setItemToDelete(cat.id)} className="p-2 sm:p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors active:scale-95">
                    <Trash2 size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && <p className="text-gray-500 py-4 text-center text-sm sm:text-base">No hay categorías dinámicas. Ve a crear una.</p>}
          </div>
        )}
      </div>
    </main>
  );
}
