import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl backdrop-blur-md font-mono text-sm max-w-md"
          style={{
            backgroundColor: '#201e26',
            borderColor: toast.type === 'success' ? '#7fa06a' : toast.type === 'error' ? '#c06e88' : '#d6a63f',
            color: '#efe8da',
          }}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#7fa06a] shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#c06e88] shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#d6a63f] shrink-0" />}
          <span className="flex-1 leading-snug">{toast.text}</span>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#3a3641] text-[#a49d90] hover:text-[#efe8da] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
