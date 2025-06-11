"use client";

import { Restaurant } from "@/types";

interface RestaurantSelectModalProps {
  open: boolean;
  restaurants: Restaurant[];
  onSelect: (restaurant: Restaurant) => void;
  onClose: () => void;
}

export default function RestaurantSelectModal({
  open,
  restaurants,
  onSelect,
  onClose,
}: RestaurantSelectModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Select Restaurant</h2>
        <div className="space-y-2">
          {restaurants.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelect(r)}
              className="w-full px-4 py-2 bg-branding-600 text-white rounded hover:bg-branding-500"
            >
              {r.name}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="text-sm text-gray-500 hover:underline">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
