export function Login() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-abu-cream w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-abu-brown mb-6">Acceso Admin</h2>
        
        <div className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            className="w-full bg-abu-light border border-abu-cream rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-abu-accent"
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full bg-abu-light border border-abu-cream rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-abu-accent"
          />
          <button className="w-full bg-abu-brown hover:bg-abu-dark text-white font-bold py-3 rounded-xl transition-colors mt-2">
            Iniciar Sesión
          </button>
        </div>
        
        <p className="text-xs text-gray-400 mt-6">
          Esta sección es de uso exclusivo para administración.
        </p>
      </div>
    </div>
  );
}
