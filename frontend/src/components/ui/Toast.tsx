import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="text-status-success" size={18} />,
    error: <AlertCircle className="text-status-error" size={18} />,
    info: <Info className="text-accent-primary" size={18} />,
    warning: <AlertTriangle className="text-status-warning" size={18} />,
  };

  const bgColors = {
    success: 'bg-status-success/10 border-status-success/20',
    error: 'bg-status-error/10 border-status-error/20',
    info: 'bg-accent-primary/10 border-accent-primary/20',
    warning: 'bg-status-warning/10 border-status-warning/20',
  };

  return (
    <div 
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-right-full fade-in duration-300",
        bgColors[type]
      )}
    >
      <div className="shrink-0">{icons[type]}</div>
      <p className="text-sm font-medium text-text-primary pr-4">{message}</p>
      <button 
        onClick={() => onClose(id)}
        className="ml-auto text-text-tertiary hover:text-text-primary transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};
