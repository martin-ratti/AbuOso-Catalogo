import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ArrowLeft, Upload, Loader2, Save, ImageIcon, Plus, X, Trash2 } from 'lucide-react';
import { uploadToCloudinary } from '../../utils/cloudinary';

const BADGES = [
  { value: '', label: 'Sin etiqueta' },
  { value: 'stock', label: 'En Stock (Verde)' },
  { value: 'pedido', label: 'A pedido (Naranja)' },
  { value: 'agotado', label: 'Agotado (Gris)' },
  { value: 'novedad', label: '¡Novedad! (Rosa)' }
];

interface GeneralImageForm {
  id: string;
  url?: string;
  file?: File;
  preview?: string;
}

interface OptionForm {
  id: string;
  name: string;
  imageUrl?: string;
  imageFile?: File;
  preview?: string;
}

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
  
  const [generalImages, setGeneralImages] = useState<GeneralImageForm[]>([]);
  const [options, setOptions] = useState<OptionForm[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingItem, setIsFetchingItem] = useState(isEditing);

  useEffect(() => {
    const fetchInitialData = async () => {
      const snap = await getDocs(collection(db, 'categories'));
      const cats = snap.docs.map(d => ({ id: d.id, name: d.data().name }));
      setCategories(cats);

      if (isEditing) {
        try {
          const docRef = doc(db, 'figures', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || '');
            setDescription(data.description || '');
            setPrice(data.price?.toString() || '');
            setCategory(data.category || '');
            setBadge(data.badge || '');
            
            // Backwards compatibility for single imageUrl vs images
            if (data.images && data.images.length > 0) {
              setGeneralImages(data.images.map((url: string) => ({ id: crypto.randomUUID(), url, preview: url })));
            } else if (data.imageUrl) {
              setGeneralImages([{ id: crypto.randomUUID(), url: data.imageUrl, preview: data.imageUrl }]);
            }
            
            if (data.options) {
              setOptions(data.options.map((opt: any) => ({
                id: crypto.randomUUID(),
                name: opt.name,
                imageUrl: opt.imageUrl,
                preview: opt.imageUrl
              })));
            }
          } else {
            addToast('Figura no encontrada', 'error');
            navigate('/admin/products');
          }
        } catch {
          addToast('Error al cargar la figura', 'error');
        } finally {
          setIsFetchingItem(false);
        }
      } else {
        if (cats.length > 0) setCategory(cats[0].name);
      }
    };
    fetchInitialData();
  }, [id, isEditing, addToast, navigate]);

  if (loading) return <div className="flex-1 flex items-center justify-center">Cargando...</div>;
  if (!user) return <Navigate to="/admin" replace />;

  const handleAddGeneralImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setGeneralImages(prev => [...prev, {
          id: crypto.randomUUID(),
          file,
          preview: event.target?.result as string
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveGeneralImage = (idToRemove: string) => {
    setGeneralImages(prev => prev.filter(img => img.id !== idToRemove));
  };

  const handleAddOption = () => {
    setOptions(prev => [...prev, { id: crypto.randomUUID(), name: '' }]);
  };

  const handleRemoveOption = (idToRemove: string) => {
    setOptions(prev => prev.filter(opt => opt.id !== idToRemove));
  };

  const handleOptionNameChange = (id: string, newName: string) => {
    setOptions(prev => prev.map(opt => opt.id === id ? { ...opt, name: newName } : opt));
  };

  const handleOptionImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setOptions(prev => prev.map(opt => opt.id === id ? {
        ...opt,
        imageFile: file,
        preview: event.target?.result as string
      } : opt));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description) {
      addToast('Por favor, completa los campos principales (nombre, precio, descripción).', 'error');
      return;
    }

    if (generalImages.length === 0 && options.length === 0) {
      addToast('Por favor sube al menos una imagen general o agrega opciones con imagen.', 'error');
      return;
    }
    
    // Check options
    for (const opt of options) {
      if (!opt.name.trim()) {
        addToast('Todas las opciones deben tener un nombre.', 'error');
        return;
      }
      if (!opt.preview) {
        addToast(`La opción "${opt.name}" debe tener una imagen seleccionada.`, 'error');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Subir imagenes generales
      const finalImagesUrls = await Promise.all(generalImages.map(async img => {
        if (img.file) return await uploadToCloudinary(img.file);
        return img.url!;
      }));

      // Subir imagenes de opciones
      const finalOptions = await Promise.all(options.map(async opt => {
        let finalUrl = opt.imageUrl;
        if (opt.imageFile) {
          finalUrl = await uploadToCloudinary(opt.imageFile);
        }
        return { name: opt.name.trim(), imageUrl: finalUrl! };
      }));

      const docData: Record<string, unknown> = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        badge: badge || null,
        images: finalImagesUrls,
        imageUrl: finalImagesUrls.length > 0 ? finalImagesUrls[0] : (finalOptions.length > 0 ? finalOptions[0].imageUrl : null),
        options: finalOptions
      };

      if (isEditing) {
        await updateDoc(doc(db, 'figures', id!), docData);
        addToast('¡Figura actualizada exitosamente!', 'success');
      } else {
        docData.createdAt = new Date();
        await addDoc(collection(db, 'figures'), docData);
        addToast('¡Figura creada exitosamente!', 'success');
      }
      
      navigate('/admin/products');

    } catch (err) {
      console.error(err);
      addToast('Error al guardar. Intenta de nuevo.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetchingItem) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-abu-accent" size={40} /></div>;
  }

  return (
    <main className="flex-1 max-w-2xl mx-auto w-full px-3 sm:px-4 py-5 sm:py-8 flex flex-col">
      <div className="mb-4 sm:mb-6">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-abu-brown hover:text-abu-accent transition-colors font-medium text-sm sm:text-base">
          <ArrowLeft size={18} /> Volver
        </button>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-abu-cream p-5 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-abu-brown mb-5 sm:mb-6">
          {isEditing ? 'Editar Figura' : 'Cargar nueva figura'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          
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

          {/* Fotos generales */}
          <div className="pt-4 border-t border-abu-cream">
            <label className="block text-sm font-bold text-gray-700 mb-2">Fotos de la figura (Generales)</label>
            <div className="flex flex-wrap gap-4">
              {generalImages.map(img => (
                <div key={img.id} className="relative w-24 h-24 sm:w-32 sm:h-32 group">
                  <img src={img.preview} alt="Vista previa" className="w-full h-full object-cover rounded-xl shadow-sm" />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveGeneralImage(img.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              <div className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-dashed border-abu-cream rounded-xl flex flex-col items-center justify-center bg-abu-light/50 hover:bg-abu-light transition-colors relative cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={handleAddGeneralImage}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Plus size={24} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-500 mt-1">Añadir</span>
              </div>
            </div>
          </div>

          {/* Opciones / Variantes */}
          <div className="pt-4 border-t border-abu-cream">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-gray-700">Opciones / Variantes (Ej: Colores, Tipos)</label>
              <button 
                type="button" 
                onClick={handleAddOption}
                className="text-xs sm:text-sm bg-abu-light hover:bg-abu-cream text-abu-brown px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1"
              >
                <Plus size={16} /> Añadir Opción
              </button>
            </div>
            
            {options.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No hay opciones agregadas. (Opcional)</p>
            ) : (
              <div className="space-y-4">
                {options.map((opt, index) => (
                  <div key={opt.id} className="flex gap-4 items-start bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100">
                    {/* Imagen de la opcion */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 border-2 border-dashed border-abu-cream rounded-lg flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer group overflow-hidden">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleOptionImageChange(opt.id, e)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      {opt.preview ? (
                        <>
                          <img src={opt.preview} alt={opt.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload size={20} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-400">
                          <ImageIcon size={20} />
                          <span className="text-[10px] text-center px-1">Subir Foto</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Detalles de la opcion */}
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase">Opción #{index + 1}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveOption(opt.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                          title="Eliminar opción"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <input 
                        type="text" 
                        value={opt.name}
                        onChange={e => handleOptionNameChange(opt.id, e.target.value)}
                        placeholder="Nombre de la opción (Ej: Verde)" 
                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-abu-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 size={20} className="animate-spin" /> {isEditing ? 'Actualizando...' : 'Subiendo imágenes y guardando...'}</>
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
