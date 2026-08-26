import { useToastStore } from '../store/toastStore';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle className="text-emerald-500" size={20} />,
          error: <XCircle className="text-red-500" size={20} />,
          info: <Info className="text-blue-500" size={20} />
        };

        const bgColors = {
          success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          error: 'bg-red-50 border-red-200 text-red-800',
          info: 'bg-blue-50 border-blue-200 text-blue-800'
        };

        return (
          <div 
            key={toast.id} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 ${bgColors[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="text-sm font-medium">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
