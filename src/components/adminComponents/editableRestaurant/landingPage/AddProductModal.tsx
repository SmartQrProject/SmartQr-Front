'use client";'

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (product: { name: string; price: string; image: string }) => void;
  category: { id: number; name: string } | null;
}

export default function AddProductModal({ open, onClose, onAdd, category }: Props) {
  if (!open || !category) return null; // Don't render if closed or no category selected

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !image) return;
    onAdd({ name, price, image });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1a1a] text-white p-6 rounded shadow-lg w-[90%] max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">
          Add New Product to <span className="text-green-400">{category.name}</span>
        </h2>

        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded bg-gray-800 placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Price (e.g. $5.40)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded bg-gray-800 placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
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

