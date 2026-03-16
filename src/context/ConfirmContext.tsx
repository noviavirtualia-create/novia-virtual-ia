import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useState<{
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setDialog({ options, resolve });
    });
  }, []);

  const handleClose = (value: boolean) => {
    if (dialog) {
      dialog.resolve(value);
      setDialog(null);
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AnimatePresence>
        {dialog && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto ${
                dialog.options.variant === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-rose-50 text-rose-500'
              }`}>
                <AlertTriangle size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                {dialog.options.title}
              </h3>
              
              <p className="text-slate-500 text-center mb-8">
                {dialog.options.message}
              </p>
              
              <div className="flex flex-col gap-3">
                <Button
                  variant={dialog.options.variant === 'danger' ? 'primary' : 'primary'}
                  className={`w-full h-12 text-base ${
                    dialog.options.variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700 border-none' : ''
                  }`}
                  onClick={() => handleClose(true)}
                >
                  {dialog.options.confirmText || 'Confirmar'}
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full h-12 text-slate-500 hover:text-slate-700"
                  onClick={() => handleClose(false)}
                >
                  {dialog.options.cancelText || 'Cancelar'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
};
