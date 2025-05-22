const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(slug: string, token: string) {
  const response = await fetch(`${APIURL}/${slug}/products?page=1&limit=10`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching products');
  }

  return response.json();
}

