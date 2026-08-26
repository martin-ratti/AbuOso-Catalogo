import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { LogOut, PackageSearch, PlusCircle, Tags, FolderPlus } from 'lucide-react';

export function Dashboard() {
  const { user, loading } = useAuthStore();

  if (loading) return <div className="flex-1 flex items-center justify-center">Cargando...</div>;
  if (!user) return <Navigate to="/admin" replace />;

  const handleLogout = () => {
    signOut(auth);
  };

  const adminActions = [
    {
      title: 'Ver Productos',
      description: 'Listado completo para editar o borrar.',
      icon: <PackageSearch size={32} className="text-abu-accent" />,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
    },
    {
      title: 'Cargar Producto',
      description: 'Agrega una nueva figura al catálogo.',
      icon: <PlusCircle size={32} className="text-emerald-600" />,
      color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
    },
    {
      title: 'Ver Categorías',
      description: 'Administra las burbujas del inicio.',
      icon: <Tags size={32} className="text-blue-600" />,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      title: 'Nueva Categoría',
      description: 'Crea una nueva burbuja de filtro.',
      icon: <FolderPlus size={32} className="text-purple-600" />,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    }
  ];

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col">
      <div className="flex justify-between items-start sm:items-center mb-8 flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-abu-brown">Panel de Control</h2>
          <p className="text-gray-500 mt-1">Bienvenido, {user.email}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl font-bold transition-colors w-full sm:w-auto justify-center"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {adminActions.map((action, idx) => (
          <button 
            key={idx}
            className={`p-6 rounded-3xl border transition-all active:scale-95 text-left flex flex-col h-full gap-4 ${action.color}`}
            onClick={() => alert(`Pronto programaremos la pantalla de: ${action.title}`)}
          >
            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm">
              {action.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-3xl border border-abu-cream shadow-sm">
        <h3 className="font-bold text-abu-brown mb-2">Resumen rápido</h3>
        <div className="flex gap-4 text-sm text-gray-600">
          <p>📦 8 Productos activos</p>
          <p>🏷️ 7 Categorías</p>
        </div>
      </div>
    </main>
  );
}
