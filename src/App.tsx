import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/Login';
import { Lock } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-abu-light flex flex-col font-sans">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<Login />} />
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
