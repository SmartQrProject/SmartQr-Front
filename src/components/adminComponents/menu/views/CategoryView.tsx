'use client';

import { useCategories } from '../menuHelpers/hook/useCategories';


const CategoriesList = () => {
  const { categories, error } = useCategories()

  return (
    <div className="space-y-4 w-full max-w-md p-6 rounded-md bg-neutral-100 shadow">
      <h2 className="text-xl font-semibold text-center border-b border-gray-100 pb-2">
        Available Categories
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      {categories.length > 0 ? (
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="bg-white rounded-xl shadow flex items-center"
            >
              <span className="font-medium p-3">{cat.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center font-medium">No categories found</p>
      )}
    </div>
  );
};

export default CategoriesList;
