// libs/hooks/products.ts

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(slug: string, token: string) {
  try {
    const response = await fetch(`${APIURL}/${slug}/products?page=1&limit=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || "Error fetching products");
  }
}

export async function uploadImage(file: File, token: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${APIURL}/cloudinary/uploadImage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al subir la imagen");
  }

  const secureUrl = await response.text();
  return secureUrl;
}

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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

  if (!res.ok) throw new Error("Error al crear producto");
  return await res.json();
}

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
  
  const res = await fetch(`${APIURL}/${slug}/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
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

  
  console.log("Product upd", res);
  

  if (!res.ok) throw new Error("Error al actualizar producto");
  return await res.json();
}
