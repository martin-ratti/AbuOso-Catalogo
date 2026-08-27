import { useState, useEffect } from 'react';
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import type { Figure } from '../../types';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit, Plus, Loader2 } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { ConfirmModal } from '../../components/ConfirmModal';
import { formatPrice } from '../../utils/format';

export function ProductList() {
  const [figures, setFigures] = useState<Figure[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore(s => s.addToast);
  
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'figures'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Figure));
      setFigures(data);
      setLoading(false);
    }, () => {
      addToast('Error al cargar productos', 'error');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [addToast]);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, 'figures', itemToDelete));
      addToast('Producto eliminado', 'success');
      setFigures(figures.filter(f => f.id !== itemToDelete));
    } catch {
      addToast('Error al eliminar', 'error');
    }
    setItemToDelete(null);
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-4 py-5 sm:py-8 flex flex-col">
      <ConfirmModal 
        isOpen={itemToDelete !== null}
        title="Eliminar producto"
        message="¿Estás seguro que deseas eliminar este producto? Esta acción no se puede deshacer."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />

      <div className="mb-4 sm:mb-6 flex justify-between items-center">
        <Link to="/admin/dashboard" className="text-abu-brown hover:text-abu-accent flex items-center gap-2 font-medium text-sm sm:text-base">
          <ArrowLeft size={18} /> Volver
        </Link>
        <Link to="/admin/products/new" className="bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 sm:gap-2 font-bold hover:bg-emerald-700 transition-all active:scale-95 hover:shadow-md text-sm sm:text-base">
          <Plus size={18} /> Nuevo
        </Link>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-abu-cream p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-abu-brown mb-4 sm:mb-6">Listado de Productos</h2>
        
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-abu-accent" size={32} /></div>
        ) : (
          <div className="divide-y divide-abu-cream">
            {figures.map(fig => (
              <div key={fig.id} className="py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {fig.imageUrl.startsWith('data:') || fig.imageUrl.startsWith('http') ? (
                     <img src={fig.imageUrl} alt={fig.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover bg-abu-cream/30 border border-abu-cream shrink-0" />
                  ) : (
                     <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 text-[10px] sm:text-xs text-center">Sin foto</div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-abu-brown text-sm sm:text-base truncate">{fig.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{fig.category} • ${formatPrice(fig.price)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link to={`/admin/products/edit/${fig.id}`} className="p-2 sm:p-2.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors active:scale-95">
                    <Edit size={18} className="sm:w-5 sm:h-5" />
                  </Link>
                  <button onClick={() => setItemToDelete(fig.id)} className="p-2 sm:p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors active:scale-95">
                    <Trash2 size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}
            {figures.length === 0 && <p className="text-gray-500 py-4 text-center text-sm sm:text-base">No hay productos en la base de datos.</p>}
          </div>
        )}
      </div>
    </main>
  );
}
