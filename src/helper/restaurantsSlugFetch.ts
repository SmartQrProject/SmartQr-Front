
const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function getRestaurantWithMenu(slug: string) {
  const res = await fetch(`${APIURL}/restaurants/public?slug=${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) return null;

  return await res.json();
}
