'use client';

import { XIcon } from 'lucide-react';
import { ReactNode } from 'react';

type ProductModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function ProductModal({
  open,
  onClose,
  children,
}: ProductModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24  overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-xl p-6 mx-4 bg-gray-300 shadow-lg overflow-y-auto">
    
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-900 hover:text-red-500 cursor-pointer"
          aria-label="Close"
        >
          <XIcon className="w-6 h-6" />
        </button>

        {children}
      </div>
    </div>
  );
}
