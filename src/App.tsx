import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-abu-light flex flex-col font-sans">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
        </Routes>

        <footer className="bg-abu-brown text-abu-cream py-8 text-center mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full opacity-80 mix-blend-screen" />
            <p className="font-medium text-base">AbuOso Artesanías</p>
            <p className="text-xs opacity-80">© {new Date().getFullYear()} - Hecho con amor.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
