
const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function getRestaurantWithMenu(slug: string) {
  const res = await fetch(`${APIURL}/restaurants/public?slug=${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const json = await res.json();

  // Verifica que realmente haya datos útiles
  if (!json || Object.keys(json).length === 0 || !json.name) {
    return null;
  }

  return json;
}