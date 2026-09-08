import { useAuthStore } from '../../store/authStore';
import { useMaintenanceStore, toggleMaintenanceMode } from '../../store/maintenanceStore';
import { Navigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { LogOut, PackageSearch, PlusCircle, Tags, FolderPlus, Package, Tag, ArrowRight, TrendingUp, Construction, AlertTriangle, HandMetal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ConfirmModal } from '../../components/ConfirmModal';
import { collection, getCountFromServer, query, orderBy, limit, getDocs } from 'firebase/firestore';
import type { Figure } from '../../types';
import { displayPrice } from '../../utils/format';

export function Dashboard() {
  const { user, loading } = useAuthStore();
  const { isMaintenanceMode } = useMaintenanceStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState(false);
  
  const [stats, setStats] = useState({ products: 0, categories: 0 });
  const [recentProducts, setRecentProducts] = useState<Figure[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchDashboardData = async () => {
      try {
        // Obtener conteos reales sin descargar todos los documentos (súper rápido y barato)
        const productsSnap = await getCountFromServer(collection(db, 'figures'));
        const categoriesSnap = await getCountFromServer(collection(db, 'categories'));
        
        // Obtener los 3 productos más recientes
        const qRecent = query(collection(db, 'figures'), orderBy('createdAt', 'desc'), limit(3));
        const recentSnap = await getDocs(qRecent);
        const recent = recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Figure));

        setStats({
          products: productsSnap.data().count,
          categories: categoriesSnap.data().count
        });
        setRecentProducts(recent);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  if (loading) return <div className="flex-1 flex items-center justify-center">Cargando...</div>;
  if (!user) return <Navigate to="/admin" replace />;

  const confirmLogout = () => {
    signOut(auth);
  };

  const handleMaintenanceToggle = async () => {
    setIsTogglingMaintenance(true);
    try {
      await toggleMaintenanceMode(!isMaintenanceMode);
    } finally {
      setIsTogglingMaintenance(false);
      setIsMaintenanceModalOpen(false);
    }
  };

  const adminActions = [
    {
      title: 'Ver Productos',
      description: 'Listado completo para editar o borrar.',
      icon: <PackageSearch size={28} className="text-orange-600" />,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      link: '/admin/products'
    },
    {
      title: 'Cargar Producto',
      description: 'Agrega una nueva figura al catálogo.',
      icon: <PlusCircle size={28} className="text-emerald-600" />,
      color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
      link: '/admin/products/new'
    },
    {
      title: 'Ver Categorías',
      description: 'Administra las burbujas del inicio.',
      icon: <Tags size={28} className="text-blue-600" />,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      link: '/admin/categories'
    },
    {
      title: 'Nueva Categoría',
      description: 'Crea una nueva burbuja de filtro.',
      icon: <FolderPlus size={28} className="text-purple-600" />,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      link: '/admin/categories/new'
    }
  ];

  const userName = user.email?.includes('roman') ? 'Román' : 'Admin';

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-4 py-5 sm:py-8 flex flex-col gap-5 sm:gap-8">
      <ConfirmModal 
        isOpen={isLogoutModalOpen}
        title="Cerrar sesión"
        message="¿Estás seguro de que quieres cerrar la sesión de administrador?"
        confirmText="Cerrar Sesión"
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />

      <ConfirmModal 
        isOpen={isMaintenanceModalOpen}
        title={isMaintenanceMode ? '¿Desactivar mantenimiento?' : '¿Activar mantenimiento?'}
        message={isMaintenanceMode 
          ? 'La tienda volverá a estar visible para todos los visitantes.' 
          : 'Los visitantes verán una pantalla de mantenimiento. Solo vos podrás acceder al panel de admin.'}
        confirmText={isTogglingMaintenance ? 'Aplicando...' : (isMaintenanceMode ? 'Desactivar' : 'Activar Mantenimiento')}
        onConfirm={handleMaintenanceToggle}
        onCancel={() => setIsMaintenanceModalOpen(false)}
      />

      {/* Banner de mantenimiento activo */}
      {isMaintenanceMode && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 animate-maintenance-pulse shadow-md">
          <div className="bg-amber-100 p-3 rounded-xl shrink-0">
            <AlertTriangle size={28} className="text-amber-600" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-black text-amber-800 text-base sm:text-lg flex items-center gap-1.5 justify-center sm:justify-start">
              <Construction size={20} className="text-amber-600" /> Modo Mantenimiento Activo
            </h3>
            <p className="text-amber-700 text-xs sm:text-sm mt-0.5">La tienda no es visible para los visitantes. Solo vos podés ver el panel.</p>
          </div>
          <button
            onClick={() => setIsMaintenanceModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all active:scale-95 text-sm whitespace-nowrap shadow-sm"
          >
            Desactivar
          </button>
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-linear-to-br from-abu-brown to-abu-dark rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 flex items-center gap-2">
              ¡Hola, {userName}! <HandMetal size={28} className="inline-block" />
            </h2>
          <p className="text-abu-cream text-sm sm:text-lg max-w-xl opacity-90">
            Bienvenido al centro de control. Desde aquí podés administrar todo tu catálogo.
          </p>
        </div>
        
        {/* Decoración de fondo */}
        <div className="absolute -right-20 -top-20 opacity-10">
          <PackageSearch size={300} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
        
        {/* Columna Izquierda: Acciones (Ocupa 2/3 en desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
          <h3 className="text-base sm:text-xl font-bold text-abu-brown flex items-center gap-2">
            <TrendingUp className="text-abu-accent" size={20} /> Acciones Rápidas
          </h3>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            {adminActions.map((action, idx) => (
              <Link 
                key={idx}
                to={action.link}
                className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all hover:scale-[1.02] active:scale-95 text-left flex flex-col gap-2.5 sm:gap-4 shadow-sm ${action.color}`}
              >
                <div className="bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm">
                  {action.icon}
                </div>
                <div>
                  <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-0.5 sm:mb-1">{action.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Widgets (Ocupa 1/3 en desktop) */}
        <div className="flex flex-col gap-6">
          
          {/* Widget Estadísticas Reales */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-abu-cream shadow-sm flex flex-col gap-3 sm:gap-4">
            <h3 className="font-bold text-abu-brown text-base sm:text-lg border-b border-abu-cream pb-2.5 sm:pb-3">Resumen de Tienda</h3>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="bg-orange-100 text-orange-600 p-2.5 sm:p-3 rounded-xl"><Package size={18} /></div>
                <span className="font-medium text-gray-600 text-sm">Productos</span>
              </div>
              <span className="text-xl sm:text-2xl font-black text-abu-brown">
                {isLoadingStats ? '...' : stats.products}
              </span>
            </div>
            
            <div className="flex justify-between items-center mt-1 sm:mt-2">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="bg-blue-100 text-blue-600 p-2.5 sm:p-3 rounded-xl"><Tag size={18} /></div>
                <span className="font-medium text-gray-600 text-sm">Categorías</span>
              </div>
              <span className="text-xl sm:text-2xl font-black text-abu-brown">
                {isLoadingStats ? '...' : stats.categories}
              </span>
            </div>
          </div>

          {/* Widget Modo Mantenimiento */}
          <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border shadow-sm flex flex-col gap-3 sm:gap-4 transition-colors ${isMaintenanceMode ? 'bg-amber-50 border-amber-200' : 'bg-white border-abu-cream'}`}>
            <div className="flex items-center gap-3 border-b border-abu-cream pb-2.5 sm:pb-3">
              <Construction size={20} className={isMaintenanceMode ? 'text-amber-600' : 'text-gray-400'} />
              <h3 className="font-bold text-abu-brown text-base sm:text-lg">Mantenimiento</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-700">Modo mantenimiento</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isMaintenanceMode ? 'La tienda está oculta' : 'La tienda está visible'}
                </p>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={() => setIsMaintenanceModalOpen(true)}
                disabled={isTogglingMaintenance}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                  isMaintenanceMode 
                    ? 'bg-amber-500 focus:ring-amber-400' 
                    : 'bg-gray-300 focus:ring-gray-400'
                }`}
                aria-label={isMaintenanceMode ? 'Desactivar modo mantenimiento' : 'Activar modo mantenimiento'}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    isMaintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Widget Últimos Productos */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-abu-cream shadow-sm flex flex-col gap-3 sm:gap-4">
            <div className="flex justify-between items-end border-b border-abu-cream pb-2.5 sm:pb-3">
              <h3 className="font-bold text-abu-brown text-base sm:text-lg">Últimos agregados</h3>
              <Link to="/admin/products" className="text-xs text-abu-accent font-bold hover:underline">Ver todos</Link>
            </div>
            
            <div className="flex flex-col gap-3">
              {isLoadingStats ? (
                <div className="text-center text-sm text-gray-400 py-4">Cargando...</div>
              ) : recentProducts.length === 0 ? (
                <div className="text-center text-sm text-gray-400 py-4">Aún no hay productos.</div>
              ) : (
                recentProducts.map(prod => (
                  <Link key={prod.id} to={`/admin/products/edit/${prod.id}`} className="flex items-center gap-3 hover:bg-abu-light p-2 rounded-xl transition-colors">
                    {prod.imageUrl ? <img src={prod.imageUrl} alt={prod.name} className="w-12 h-12 rounded-lg object-cover bg-abu-cream shrink-0" /> : <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0" />}
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-sm text-gray-800 truncate">{prod.name}</p>
                      <p className="text-xs font-medium text-abu-accent">{displayPrice(prod.price)}</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-400" />
                  </Link>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="mt-4 pt-6 border-t border-gray-200 flex justify-center">
        <button 
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 font-bold transition-colors py-2 px-6 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </div>
    </main>
  );
}
