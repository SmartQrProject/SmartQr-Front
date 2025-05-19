'use client';

import { XIcon } from 'lucide-react';
import { ReactNode } from 'react';

type ProductFormWrapperProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function ProductFormWrapper({
  open,
  onClose,
  children,
}: ProductFormWrapperProps) {
  if (!open) return null;

  return (
   <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 ">
        <div className="relative w-full max-w-xl bg-black/1 rounded-xl p-6 mx-4 overflow-y-auto ">
            <button
            onClick={onClose}
            className="absolute top-3 right-1 text-default-100 hover:text-red-800 font-bold cursor-pointer"
            aria-label="Close"
            >
            <XIcon className="w-8 h-8" />
            </button>

            {children}
        </div>
    </div>


  );
}
