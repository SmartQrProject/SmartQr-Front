import { useEffect, useState } from 'react';
import { getCategories } from '../fetch/categories';
import { ICategories } from '../../menuTypes/menuTypes';

export function useCategories() {
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = localStorage.getItem("adminSession");
        if (!session) throw new Error("No session found");

        const parsed = JSON.parse(session);
        const token = parsed.token;
        const slug = parsed.payload?.slug;
        if (!slug) throw new Error("Slug not found in session");

        const data = await getCategories(slug, token);
        setCategories(data.categories || []);
      } catch (err: any) {
        setError(err.message || "Error fetching categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { categories, error, isLoading };
}
