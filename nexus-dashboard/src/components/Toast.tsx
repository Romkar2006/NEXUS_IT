import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { X, AlertCircle, ShieldCheck, Radio, Terminal } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_DURATION = 5000; // 5 Seconds as requested

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-8 right-8 z-[1000] flex flex-col gap-4 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast, onRemove: () => void }) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / TOAST_DURATION) * 100);
      setProgress(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
        onRemove();
      }
    }, 10);

    return () => clearInterval(interval);
  }, [onRemove, isPaused]);

  const config = {
    success: { 
        icon: ShieldCheck, 
        color: "text-emerald-400", 
        border: "border-emerald-500/30",
        bar: "bg-emerald-500", 
        glow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]",
        label: "Secure Protocol Verified" 
    },
    error: { 
        icon: AlertCircle, 
        color: "text-rose-400", 
        border: "border-rose-500/30",
        bar: "bg-rose-500", 
        glow: "shadow-[0_0_30px_rgba(244,63,94,0.2)]",
        label: "Operational Breach" 
    },
    info: { 
        icon: Radio, 
        color: "text-indigo-400", 
        border: "border-indigo-500/30",
        bar: "bg-indigo-500", 
        glow: "shadow-[0_0_30px_rgba(99,102,241,0.2)]",
        label: "Infrastructure Update" 
    },
  }[toast.type];

  const Icon = config.icon;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto group relative w-[24rem] bg-[#0a0a0acc] backdrop-blur-3xl border ${config.border} rounded-2xl overflow-hidden animate-in slide-in-from-right-full fade-in duration-500 ${config.glow}`}
    >
      {/* 🔮 High-End Glass Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="relative z-10 p-5 flex items-start gap-4">
        {/* 🚦 Status Icon Container */}
        <div className={`mt-1 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] shadow-inner transition-all group-hover:scale-110 group-hover:rotate-6 ${config.color}`}>
            <Icon size={20} strokeWidth={2.5} className={toast.type === 'success' ? 'animate-pulse' : ''} />
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-1">
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] font-mono opacity-50 group-hover:opacity-100 transition-opacity ${config.color}`}>
                    {config.label}
                </span>
                <button 
                  onClick={onRemove} 
                  className="p-1 -mr-2 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-all transform hover:rotate-90"
                >
                  <X size={16} />
                </button>
            </div>
            
            <h4 className="text-[13px] font-bold text-white/90 leading-snug tracking-tight mb-2 pr-4">
                {toast.message}
            </h4>

            <div className="flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-all">
                <Terminal size={10} className="text-white" />
                <span className="text-[9px] font-black font-mono text-white tracking-widest uppercase truncate">
                    TXN_ID: {toast.id.toString().slice(-8)}
                </span>
            </div>
        </div>
      </div>

      {/* ⏳ Precision Progress Bar (Bottom) */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-white/[0.03]">
        <div 
          className={`h-full opacity-80 transition-all duration-100 ease-linear ${config.bar}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* 🎨 Subtle Corner Glow */}
      <div className={`absolute -right-12 -bottom-12 w-24 h-24 rounded-full blur-3xl opacity-20 pointer-events-none ${config.bar}`} />
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
