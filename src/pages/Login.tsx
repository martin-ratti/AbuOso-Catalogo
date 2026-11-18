import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Eye, EyeOff } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user, loading } = useAuthStore();

  if (loading) return <div className="flex-1 flex items-center justify-center">Cargando...</div>;
  
  // Si ya está logueado, mandarlo al dashboard
  if (user) return <Navigate to="/admin/dashboard" replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-abu-cream w-full max-w-sm text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-abu-brown mb-5 sm:mb-6">Acceso Admin</h2>
        
        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-bold text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input 
              id="admin-email"
              name="email"
              type="email" 
              autoComplete="username"
              spellCheck={false}
              placeholder="correo@ejemplo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-abu-light border border-abu-cream rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-abu-accent"
              required
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-xs font-bold text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input 
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"} 
                autoComplete="current-password"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-abu-light border border-abu-cream rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-abu-accent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-abu-accent transition-colors p-1"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-abu-brown hover:bg-abu-dark text-white font-bold py-3 rounded-xl transition-colors mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <p className="text-xs text-gray-400 mt-6">
          Esta sección es de uso exclusivo para la administración de AbuOso Artesanías.
        </p>
      </div>
    </div>
  );
}
