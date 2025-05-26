'use client';
import { Dialog } from '@headlessui/react';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({ open, onClose, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0" />
      <div className="relative bg-white rounded-lg p-6 max-w-sm w-full z-50">
        <Dialog.Title className="font-semibold text-lg">Delete Category</Dialog.Title>
        <p className="mt-2 text-gray-700">Are you sure you want to delete this category?</p>
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </Dialog>
  );
}
