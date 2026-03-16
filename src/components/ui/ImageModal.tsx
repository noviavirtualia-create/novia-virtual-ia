import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, src, alt }) => {
  if (!src) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 sm:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Controls */}
            <div className="absolute -top-12 right-0 flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white transition-colors bg-white/10 rounded-full backdrop-blur-md"
                title="Cerrar"
              >
                <X size={24} />
              </button>
            </div>

            <img
              src={src}
              alt={alt || 'Full screen view'}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
