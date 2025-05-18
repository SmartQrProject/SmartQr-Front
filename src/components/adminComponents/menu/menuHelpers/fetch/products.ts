import { log } from "console";
import { ProductFormData } from "../schemas/createProductSchema";


const APIURL = process.env.NEXT_PUBLIC_API_URL
const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

export async function getProducts (slug: string, token: string) {
  try {
    const response = await fetch(`${APIURL}/${slug}/products?page=1&limit=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    return response.json();

  } catch (error: any) {
    throw new Error(error.message || "Error fetching products");
  }
}

export async function uploadImage(file: File, token: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  // formData.append("upload_preset", `${preset}`);
  console.log("Subiendo imagen:", file);
  
  const response = await fetch(`https://smartqr-back.onrender.com/cloudinary/uploadImage`, {
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
console.log("Respuesta Cloudinary (texto plano):", secureUrl);
return secureUrl;
}


//enviando producto a la base de datos


const createProduct = async ({
  slug,
  name,
  description,
  price,
  categoryId,
  image_url,
  token,
}: {
  slug: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image_url: string;
  token: string;
}) => {
console.log("Enviando producto:", {
  name,
  description,
  price,
  categoryId,
  image_url,
});
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
    }),
  });
  console.log("Respuesta del servidor:", res);
  if (!res.ok) throw new Error('Error al crear producto' + Error);
  return await res.json();
}
export default createProduct;


// export async function createProduct( token: string, data: ProductFormData & { image: string }, slug: string) {
//   const response = await fetch(`${APIURL}/${slug}/products`, {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     const text = await response.text();
//     console.error("Error en backend:", text);
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   return response.json();
// }



// export async function createProduct (token: string, data: ProductFormData, slug: string) {
//     try {
        
//         const response = await fetch(`${APIURL}/${slug}/products`,{
//             method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//               },
//             body: JSON.stringify(data),
//         })

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Failed to create product");
//     }

//     return { success: true };
//   } catch (error) {
//     console.error("Error creating product:", error);
//     return { success: false };
//   }
// }