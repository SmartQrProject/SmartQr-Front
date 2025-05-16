'use client';

import { useEffect, useState } from 'react';
import { getCategories } from '../menuHelpers/fetch/categories';
import { ICategories } from '../menuTypes/menuTypes';

// ✅ función utilitaria para decodificar JWT
function parseJwt(token: string) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

const CategoriesList = () => {
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedData = localStorage.getItem("adminSession");

      if (!storedData) {
        setError("Token not found");
        return;
      }

      const parsed = JSON.parse(storedData);
      const token = parsed.token;

      const payload = parseJwt(token);
      const slug = payload?.slug;
      console.log(slug);
      
      if (!slug) {
        setError("Slug not found in token");
        return;
      }

      try {
        const data = await getCategories(slug, token);
        setCategories(data.categories || []);
      } catch (err: any) {
        setError(err.message || "Error fetching categories");
      }
    };

    fetchData();
  }, []);

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
