// File: src/components/ui/Toast.jsx

import { useToast } from '../../context/ToastContext';
import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

// Konfigurasi style untuk setiap tipe toast
const toastStyles = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/40',
    border: 'border border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-800 dark:text-emerald-300',
    icon: CheckCircle,
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/40',
    border: 'border border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-300',
    icon: AlertCircle,
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/40',
    border: 'border border-amber-200 dark:border-amber-800',
    text: 'text-amber-800 dark:text-amber-300',
    icon: AlertTriangle,
  },
};

const Toast = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type] || toastStyles.success;
        const Icon = style.icon;

        return (
          <div
            key={toast.id}
            className={`
              ${style.bg} ${style.border} ${style.text}
              rounded-xl shadow-lg px-4 py-3
              flex items-center gap-3
              min-w-[320px] max-w-[420px]
              animate-[slideIn_0.3s_ease-out]
            `}
          >
            <Icon size={20} />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;