import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';

const CATEGORIES = ['Todos', 'Nuevos', 'Combos', 'Ositos', 'Animalitos', 'Macetas', 'Navideñas'];
const BADGES = [
  { value: '', label: 'Sin etiqueta' },
  { value: 'stock', label: 'En Stock (Verde)' },
  { value: 'pedido', label: 'A pedido (Naranja)' },
  { value: 'agotado', label: 'Agotado (Gris)' },
  { value: 'novedad', label: '¡Novedad! (Rosa)' }
];

export function ProductForm() {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[3]); // Default Ositos
  const [badge, setBadge] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (loading) return <div className="flex-1 flex items-center justify-center">Cargando...</div>;
  if (!user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description || !imageFile) {
      setError('Por favor, completa todos los campos y selecciona una imagen.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Subir imagen a Storage
      const storageRef = ref(storage, `figures/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // 2. Guardar datos en Firestore
      const docData = {
        name,
        description,
        price: Number(price),
        category,
        badge: badge || null,
        imageUrl,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'figures'), docData);
      
      alert('¡Figura creada exitosamente!');
      navigate('/admin/dashboard');

    } catch (err: any) {
      console.error(err);
      setError('Hubo un error al guardar la figura. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 flex flex-col">
      <div className="mb-6">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-abu-brown hover:text-abu-accent transition-colors font-medium">
          <ArrowLeft size={18} /> Volver al panel
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-abu-cream p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-abu-brown mb-6">Cargar nueva figura</h2>
        
        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre de la figura</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Osito Pintor" 
              className="w-full bg-abu-light border border-abu-cream rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-abu-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Precio ($)</label>
              <input 
                type="number" 
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="Ej: 1500" 
                className="w-full bg-abu-light border border-abu-cream rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-abu-accent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-abu-light border border-abu-cream rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-abu-accent"
              >
                {CATEGORIES.filter(c => c !== 'Todos' && c !== 'Nuevos').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Etiqueta (Badge)</label>
            <select 
              value={badge}
              onChange={e => setBadge(e.target.value)}
              className="w-full bg-abu-light border border-abu-cream rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-abu-accent"
            >
              {BADGES.map(b => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Escribe los detalles de la figura..." 
              rows={4}
              className="w-full bg-abu-light border border-abu-cream rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-abu-accent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Foto del producto</label>
            <div className="border-2 border-dashed border-abu-cream rounded-2xl p-6 flex flex-col items-center justify-center bg-abu-light/50 hover:bg-abu-light transition-colors relative cursor-pointer group">
              <input 
                type="file" 
                accept="image/*"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-abu-accent transition-colors">
                <Upload size={32} />
                <span className="text-sm font-medium">
                  {imageFile ? imageFile.name : 'Toca para subir una imagen'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 size={20} className="animate-spin" /> Guardando y subiendo foto...</>
              ) : (
                <><Save size={20} /> Guardar Producto</>
              )}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
