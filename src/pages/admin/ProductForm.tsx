import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { Navigate, Link, useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ArrowLeft, Upload, Loader2, Save } from 'lucide-react';

const BADGES = [
  { value: '', label: 'Sin etiqueta' },
  { value: 'stock', label: 'En Stock (Verde)' },
  { value: 'pedido', label: 'A pedido (Naranja)' },
  { value: 'agotado', label: 'Agotado (Gris)' },
  { value: 'novedad', label: '¡Novedad! (Rosa)' }
];

export function ProductForm() {
  const { user, loading } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [badge, setBadge] = useState('');
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  
  // Almacenamos el Base64 de la imagen o URL existente
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingItem, setIsFetchingItem] = useState(isEditing);

  useEffect(() => {
    const fetchInitialData = async () => {
      // 1. Fetch categories
      const snap = await getDocs(collection(db, 'categories'));
      const cats = snap.docs.map(d => ({ id: d.id, name: d.data().name }));
      setCategories(cats);

      // 2. If editing, fetch product data
      if (isEditing) {
        try {
          const docRef = doc(db, 'figures', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name);
            setDescription(data.description);
            setPrice(data.price.toString());
            setCategory(data.category);
            setBadge(data.badge || '');
            setImageBase64(data.imageUrl);
          } else {
            addToast('Figura no encontrada', 'error');
            navigate('/admin/products');
          }
        } catch (error) {
          addToast('Error al cargar la figura', 'error');
        } finally {
          setIsFetchingItem(false);
        }
      } else {
        if (cats.length > 0) setCategory(cats[0].name);
      }
    };
    fetchInitialData();
  }, [id, isEditing]);

  if (loading) return <div className="flex-1 flex items-center justify-center">Cargando...</div>;
  if (!user) return <Navigate to="/admin" replace />;

  // Función para comprimir la imagen en el navegador
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Redimensionar si es muy grande (max 800x800)
        const MAX_SIZE = 800;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir a WebP con 70% de calidad
        const compressedBase64 = canvas.toDataURL('image/webp', 0.7);
        setImageBase64(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description || !imageBase64) {
      addToast('Por favor, completa todos los campos y selecciona una imagen.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const docData: any = {
        name,
        description,
        price: Number(price),
        category,
        badge: badge || null,
        imageUrl: imageBase64
      };

      if (isEditing) {
        await updateDoc(doc(db, 'figures', id), docData);
        addToast('¡Figura actualizada exitosamente!', 'success');
      } else {
        docData.createdAt = new Date();
        await addDoc(collection(db, 'figures'), docData);
        addToast('¡Figura creada exitosamente!', 'success');
      }
      
      navigate('/admin/products');

    } catch (err: any) {
      console.error(err);
      addToast(`Error al guardar: ${err.message || 'Intenta de nuevo.'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetchingItem) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-abu-accent" size={40} /></div>;
  }

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 flex flex-col">
      <div className="mb-6">
        <Link to="/admin/products" className="inline-flex items-center gap-2 text-abu-brown hover:text-abu-accent transition-colors font-medium">
          <ArrowLeft size={18} /> Volver a productos
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-abu-cream p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-abu-brown mb-6">
          {isEditing ? 'Editar Figura' : 'Cargar nueva figura'}
        </h2>

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
                {categories.length === 0 && <option value="">Crea una categoría primero</option>}
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
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
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {imageBase64 ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={imageBase64} alt="Vista previa" className="w-32 h-32 object-cover rounded-xl shadow-sm" />
                  <span className="text-sm font-medium text-abu-accent">{fileName} (Toca para cambiar)</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-abu-accent transition-colors">
                  <Upload size={32} />
                  <span className="text-sm font-medium">Toca para subir una imagen</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 size={20} className="animate-spin" /> {isEditing ? 'Actualizando...' : 'Guardando y subiendo foto...'}</>
              ) : (
                <><Save size={20} /> {isEditing ? 'Guardar Cambios' : 'Guardar Producto'}</>
              )}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
