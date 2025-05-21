const APIURL= process.env.NEXT_PUBLIC_API_URL;

export async function createProduct({
  slug,
  name,
  description,
  price,
  categoryId,
  image_url,
  is_available,
  details,
  token,
}: {
  slug: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image_url: string;
  is_available: boolean;
  details: string[];
  token: string;
}) {
  const res = await fetch(`${APIURL}/${slug}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      price,
      description,
      image_url,
      categoryId,
      is_available,
      details,
    }),
  });

  if (!res.ok) throw new Error('Error creating product');
  return res.json();
}