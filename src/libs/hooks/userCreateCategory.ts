'use client';

import { useAuth } from '@/app/(admin)/login/adminLoginContext';
import { toast } from 'react-hot-toast';

export function userCreateCategory() {
  const { user } = useAuth();

  const createCategory = async (name: string) => {
    if (!user?.payload?.slug || !user?.token) {
      toast.error('Missing session or token');
      return null;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${user.payload.slug}/categories`, // ✅ correct endpoint
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Error creating category');
        return null;
      }

      toast.success('Category created!');
      return data;
    } catch (err) {
      console.error('[createCategory]', err);
      toast.error('Network error');
      return null;
    }
  };

  return { createCategory };
}
