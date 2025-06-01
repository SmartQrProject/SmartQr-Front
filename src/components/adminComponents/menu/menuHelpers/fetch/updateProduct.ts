const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function updateProduct({
    slug,
    productId,
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
    productId: string;
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

    const res = await fetch(`${APIURL}/${slug}/products/${productId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(productPayload),
    });

    if (!res.ok) throw new Error("Error al actualizar producto");
    return await res.json();
}
