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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-default-100 text-default-800 p-6 rounded shadow-lg w-[90%] max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">
          {mode === 'edit' ? 'Edit Category' : 'Add New Category'}
        </h2>

        <input
          type="text"
          placeholder="Category name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded bg-default-50 placeholder-default-800"
        />

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border-2 border-default-800 text-default-800 rounded hover:bg-default-700 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-default-800 rounded hover:bg-default-700 text-white"
          >
            {mode === 'edit' ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}
