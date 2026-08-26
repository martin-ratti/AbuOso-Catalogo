import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { LogOut, Plus, Edit2, Trash2 } from 'lucide-react';
import { MOCK_FIGURES } from '../data/mock';

export function Dashboard() {
  const { user, loading } = useAuthStore();

  if (loading) return <div className="flex-1 flex items-center justify-center">Cargando...</div>;
  if (!user) return <Navigate to="/admin" replace />;

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:py-10 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-abu-brown">Panel de Administración</h2>
          <p className="text-gray-500 text-sm">Administra tus figuras de yeso</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <LogOut size={16} /> Salir
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-abu-cream p-6 flex-1">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-abu-brown">Tus Figuras</h3>
          <button className="flex items-center gap-2 bg-abu-accent hover:bg-[#7a4e2b] text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Plus size={16} /> Nueva Figura
          </button>
        </div>

        {/* Tabla / Lista de productos (Por ahora usa mock, luego usará Firebase) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-abu-cream text-gray-500 text-sm">
                <th className="pb-3 font-medium">Producto</th>
                <th className="pb-3 font-medium">Categoría</th>
                <th className="pb-3 font-medium">Precio</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_FIGURES.map(fig => (
                <tr key={fig.id} className="border-b border-abu-light hover:bg-abu-light/50 transition-colors">
                  <td className="py-4 flex items-center gap-3">
                    <img src={fig.imageUrl} alt={fig.name} className="w-10 h-10 rounded-md object-cover bg-abu-cream" />
                    <span className="font-bold text-abu-dark text-sm">{fig.name}</span>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{fig.category || '-'}</td>
                  <td className="py-4 text-sm font-medium text-abu-accent">${fig.price}</td>
                  <td className="py-4">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                      {fig.badge || 'Normal'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"><Edit2 size={16} /></button>
                      <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}
