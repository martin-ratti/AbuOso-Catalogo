import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, message, confirmText = 'Eliminar', onConfirm, onCancel }: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirm-modal-title"
      onClose={onCancel}
      onClick={handleBackdropClick}
      className="m-auto rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-[calc(100%-2rem)] max-w-sm shadow-xl bg-white backdrop:bg-black/50 backdrop:backdrop-blur-xs relative border-0"
    >
      <button 
        type="button"
        onClick={onCancel}
        aria-label="Cerrar modal"
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={20} aria-hidden="true" />
      </button>
      
      <div className="flex flex-col items-center text-center mt-2">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-4">
          <AlertTriangle size={24} aria-hidden="true" />
        </div>
        <h3 id="confirm-modal-title" className="text-xl font-bold text-abu-brown mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex w-full gap-3">
          <button 
            type="button"
            autoFocus
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="flex-1 py-2.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
}
