'use client';

import { useAuth } from '@/app/(admin)/login/adminLoginContext';
import EditableCategories from './EditableCategories';

export default function CategorySlug() {
  const { user } = useAuth();
  const slug = user?.slug || user?.slug || user?.slug;

  if (!slug) return <p>Loading...</p>;

  return <EditableCategories slug={slug} />;
}
