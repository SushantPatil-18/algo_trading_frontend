import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

let addToast;

export const toast = {
  success: (message, options = {}) => {
    addToast?.({ type: 'success', message, ...options });
  },
  error: (message, options = {}) => {
    addToast?.({ type: 'error', message, ...options });
  },
  info: (message, options = {}) => {
    addToast?.({ type: 'info', message, ...options });
  },
  warning: (message, options = {}) => {
    addToast?.({ type: 'warning', message, ...options });
  },
};

const ToastItem = ({ toast, onRemove }) => {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: 'bg-success-50 border-success-200 text-success-800',
    error: 'bg-danger-50 border-danger-200 text-danger-800',
    info: 'bg-primary-50 border-primary-200 text-primary-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const Icon = icons[toast.type];

  return (
    <div className={`max-w-sm w-full ${colors[toast.type]} border rounded-lg p-4 shadow-lg mb-3 animate-in slide-in-from-right-full`}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          {toast.title && (
            <h4 className="font-semibold mb-1">{toast.title}</h4>
          )}
          <p className="text-sm">{toast.message}</p>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToast = (toastData) => {
      const id = Date.now() + Math.random();
      const duration = toastData.duration ?? 5000;
      
      setToasts((prevToasts) => [
        ...prevToasts,
        { id, duration, type: 'info', ...toastData },
      ]);
    };

    return () => {
      addToast = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body
  );
};