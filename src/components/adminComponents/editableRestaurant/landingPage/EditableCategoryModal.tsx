'use client';
import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';

interface Props {
  open: boolean;
  initialName: string;
  onClose: () => void;
  onSave: (newName: string) => void;
}

export default function EditCategoryModal({ open, initialName, onClose, onSave }: Props) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0" />
      <div className="relative bg-white rounded-lg p-6 max-w-sm w-full z-50">
        <Dialog.Title className="font-semibold text-lg">Edit Category</Dialog.Title>
        <input
          className="w-full mt-4 border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={() => onSave(name)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </Dialog>
  );
}
