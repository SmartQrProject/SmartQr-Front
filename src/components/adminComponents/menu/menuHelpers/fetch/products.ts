const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(slug: string, token: string) {
    try {
        const response = await fetch(`${APIURL}/${slug}/products?page=1&limit=10`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        return response.json();
    } catch (error: any) {
        throw new Error(error.message || "Error fetching products");
    }
}

export async function getProductsById(slug: string, token: string, id: string) {
    try {
        const response = await fetch(`${APIURL}/${slug}/products/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
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

    console.log("Subiendo imagen:", file);

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
    console.log("Respuesta Cloudinary (texto plano):", secureUrl);
    return secureUrl;
}


const createProduct = async ({
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
}) => {
    console.log("Enviando producto:", {
        name,
        description,
        price,
        categoryId,
        image_url,
        is_available,
        details,
    });
    const res = await fetch(`${APIURL}/${slug}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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
    console.log("Respuesta del servidor:", res);
    if (!res.ok) throw new Error("Error al crear producto" + Error);
    return await res.json();
};
export default createProduct;
