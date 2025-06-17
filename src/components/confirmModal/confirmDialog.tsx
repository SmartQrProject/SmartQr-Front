'use client'
import React from 'react'

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;

}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,

}) => {
  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

    <div className={`relative bg-white rounded-xl p-6 shadow-lg max-w-sm w-full pointer-events-auto `}>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      <p className="mb-6">{message}</p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

};

export default ConfirmDialog;
