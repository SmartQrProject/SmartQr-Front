import { useState } from "react";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
}

export default function AddCategoryModal({ open, onClose, onSave }: AddCategoryModalProps) {
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = category.trim();
    if (!trimmed) return;
    onSave(trimmed);
    onClose();
  };

  // ✅ Do not render anything if `open` is false
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1a1a] text-white p-6 rounded shadow-lg w-[90%] max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Category</h2>

        <input
          type="text"
          placeholder="Category name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded bg-gray-800 placeholder-gray-400"
        />

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
