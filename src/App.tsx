import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { NotFound } from './pages/NotFound';
import { ToastContainer } from './components/ToastContainer';
import { Lock, Loader2 } from 'lucide-react';

// Lazy load de las páginas de admin (no las descarga el cliente que solo mira el catálogo)
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const ProductForm = lazy(() => import('./pages/admin/ProductForm').then(m => ({ default: m.ProductForm })));
const ProductList = lazy(() => import('./pages/admin/ProductList').then(m => ({ default: m.ProductList })));
const CategoryList = lazy(() => import('./pages/admin/CategoryList').then(m => ({ default: m.CategoryList })));
const CategoryForm = lazy(() => import('./pages/admin/CategoryForm').then(m => ({ default: m.CategoryForm })));

function AdminFallback() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <Loader2 size={32} className="animate-spin text-abu-accent" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-abu-light flex flex-col font-sans">
        <Navbar />
        <ToastContainer />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          
          {/* Rutas Admin - cargadas bajo demanda */}
          <Route path="/admin" element={<Suspense fallback={<AdminFallback />}><Login /></Suspense>} />
          <Route path="/admin/dashboard" element={<Suspense fallback={<AdminFallback />}><Dashboard /></Suspense>} />
          <Route path="/admin/products" element={<Suspense fallback={<AdminFallback />}><ProductList /></Suspense>} />
          <Route path="/admin/products/new" element={<Suspense fallback={<AdminFallback />}><ProductForm /></Suspense>} />
          <Route path="/admin/products/edit/:id" element={<Suspense fallback={<AdminFallback />}><ProductForm /></Suspense>} />
          <Route path="/admin/categories" element={<Suspense fallback={<AdminFallback />}><CategoryList /></Suspense>} />
          <Route path="/admin/categories/new" element={<Suspense fallback={<AdminFallback />}><CategoryForm /></Suspense>} />
          <Route path="/admin/categories/edit/:id" element={<Suspense fallback={<AdminFallback />}><CategoryForm /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer className="bg-abu-brown text-abu-cream py-6 sm:py-8 text-center mt-auto relative safe-bottom">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2.5 sm:gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full opacity-80 mix-blend-screen" />
            <div className="flex flex-col items-center gap-1">
              <p className="font-semibold text-sm sm:text-base">AbuOso Artesanías</p>
              <a 
                href="https://www.instagram.com/abuoso.artesanias/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs sm:text-sm text-abu-cream/80 hover:text-white hover:scale-105 transition-all active:scale-95"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                @abuoso.artesanias
              </a>
            </div>
            <p className="text-[11px] sm:text-xs opacity-60 mt-0.5">© {new Date().getFullYear()} - Hecho con amor ❤️</p>
          </div>
          
          {/* Botón oculto para admin */}
          <Link 
            to="/admin" 
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-abu-cream/30 hover:text-white transition-colors p-1"
            title="Administración"
          >
            <Lock size={14} />
          </Link>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
