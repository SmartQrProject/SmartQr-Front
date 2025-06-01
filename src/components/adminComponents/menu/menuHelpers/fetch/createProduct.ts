const APIURL = process.env.NEXT_PUBLIC_API_URL;

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
  const productPayload = Object.fromEntries(
    Object.entries({
      name,
      price,
      description,
      image_url,
      categoryId,
      is_available,
      details,
    }).filter(
      ([, v]) =>
        v !== null &&
        v !== undefined &&
        !(typeof v === 'string' && v.trim() === '') &&
        !(Array.isArray(v) && v.length === 0)
    )
  );

  console.log('📤 PAYLOAD', productPayload);

  try {
    const res = await fetch(`${APIURL}/${slug}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productPayload),
    });

    const data = await res.json().catch(() => null); // Por si no es JSON válido

    if (!res.ok) {
      console.error('❌ Error al crear el producto:', {
        status: res.status,
        statusText: res.statusText,
        body: data,
      });
      throw new Error(data?.message || data?.error || 'Unknown error');
    }

    return data;
  } catch (error) {
    console.error('❗ Error en la petición:', error);
    throw error;
  }
}
