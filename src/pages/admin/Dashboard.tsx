import { useAuthStore } from '../../store/authStore';
import { Navigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { LogOut, PackageSearch, PlusCircle, Tags, FolderPlus, Package, Tag } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '../../components/ConfirmModal';

export function Dashboard() {
  const { user, loading } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  if (loading) return <div className="flex-1 flex items-center justify-center">Cargando...</div>;
  if (!user) return <Navigate to="/admin" replace />;

  const confirmLogout = () => {
    signOut(auth);
  };

  const adminActions = [
    {
      title: 'Ver Productos',
      description: 'Listado completo para editar o borrar.',
      icon: <PackageSearch size={32} className="text-abu-accent" />,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      link: '/admin/products'
    },
    {
      title: 'Cargar Producto',
      description: 'Agrega una nueva figura al catálogo.',
      icon: <PlusCircle size={32} className="text-emerald-600" />,
      color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
      link: '/admin/products/new'
    },
    {
      title: 'Ver Categorías',
      description: 'Administra las burbujas del inicio.',
      icon: <Tags size={32} className="text-blue-600" />,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      link: '/admin/categories'
    },
    {
      title: 'Nueva Categoría',
      description: 'Crea una nueva burbuja de filtro.',
      icon: <FolderPlus size={32} className="text-purple-600" />,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      link: '/admin/categories/new'
    }
  ];

  // Extraer nombre del correo (ej: romanratti46@gmail.com -> Román)
  // Como sabemos que es roman, lo hardcodeamos o lo capitalizamos
  const userName = user.email?.includes('roman') ? 'Román' : 'Admin';

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col">
      <ConfirmModal 
        isOpen={isLogoutModalOpen}
        title="Cerrar sesión"
        message="¿Estás seguro de que quieres cerrar la sesión de administrador?"
        confirmText="Cerrar Sesión"
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />

      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-abu-brown">Panel de Control</h2>
        <p className="text-gray-500 mt-1 text-lg">¡Bienvenido, {userName}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        {adminActions.map((action, idx) => (
          <Link 
            key={idx}
            to={action.link}
            className={`p-6 rounded-3xl border transition-all active:scale-95 text-left flex flex-col h-full gap-4 ${action.color}`}
          >
            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm">
              {action.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-3xl border border-abu-cream shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-abu-brown mb-3">Resumen rápido</h3>
          <div className="flex gap-6 text-sm text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-abu-accent" />
              <span>8 Productos activos</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-blue-500" />
              <span>7 Categorías</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-abu-cream flex justify-center">
        <button 
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold transition-colors py-2 px-4 rounded-xl hover:bg-red-50"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>
    </main>
  );
}
