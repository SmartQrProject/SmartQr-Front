import { useState, useEffect } from "react";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  initialName?: string;
  mode?: 'create' | 'edit';
}

export default function AddCategoryModal({
  open,
  onClose,
  onSave,
  initialName = '',
  mode = 'create',
}: AddCategoryModalProps) {
  const [category, setCategory] = useState('');

  useEffect(() => {
    setCategory(initialName);
  }, [initialName, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = category.trim();
    if (!trimmed) return;
    await onSave(trimmed);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 text-branding-900 p-6 rounded shadow-lg w-[90%] max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">
          {mode === 'edit' ? 'Edit Category' : 'Add New Category'}
        </h2>

        <input
          type="text"
          placeholder="Category name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded bg-default-100 placeholder-default-800"
        />

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border-2 border-branding-500 text-branding-500 rounded hover:bg-branding-600 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-branding-600 rounded hover:bg-branding-500 text-white cursor-pointer"
          >
            {mode === 'edit' ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}
