'use client';

import { useAuth } from '@/app/(admin)/login/adminLoginContext';
import EditableCategories from './EditableCategories';

export default function CategorySlug() {
  const { user } = useAuth();
  const slug = user?.payload?.slug || user?.payload?.slug || user?.payload?.slug;

  if (!slug) return <p>Store not found</p>;

  return <EditableCategories slug={slug} />;
}
