import { useToastStore } from '../store/toastStore';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 z-[80] flex flex-col gap-2 w-[calc(100%-2rem)] sm:w-auto sm:max-w-sm">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle className="text-emerald-500 shrink-0" size={20} />,
          error: <XCircle className="text-red-500 shrink-0" size={20} />,
          info: <Info className="text-blue-500 shrink-0" size={20} />
        };

        const bgColors = {
          success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          error: 'bg-red-50 border-red-200 text-red-800',
          info: 'bg-blue-50 border-blue-200 text-blue-800'
        };

        return (
          <div 
            key={toast.id} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-fade-in-up ${bgColors[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="ml-1 opacity-60 hover:opacity-100 transition-opacity shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
