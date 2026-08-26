import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { ProductForm } from './pages/admin/ProductForm';
import { ProductList } from './pages/admin/ProductList';
import { CategoryList } from './pages/admin/CategoryList';
import { CategoryForm } from './pages/admin/CategoryForm';
import { ToastContainer } from './components/ToastContainer';
import { Lock } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-abu-light flex flex-col font-sans">
        <Navbar />
        <ToastContainer />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/products/new" element={<ProductForm />} />
          <Route path="/admin/products/edit/:id" element={<ProductForm />} />
          <Route path="/admin/categories" element={<CategoryList />} />
          <Route path="/admin/categories/new" element={<CategoryForm />} />
        </Routes>

        <footer className="bg-abu-brown text-abu-cream py-8 text-center mt-auto relative">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full opacity-80 mix-blend-screen" />
            <p className="font-medium text-base">AbuOso Artesanías</p>
            <p className="text-xs opacity-80">© {new Date().getFullYear()} - Hecho con amor.</p>
          </div>
          
          {/* Botón oculto para admin */}
          <Link 
            to="/admin" 
            className="absolute bottom-4 right-4 text-abu-cream/50 hover:text-white transition-colors"
            title="Administración"
          >
            <Lock size={16} />
          </Link>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
