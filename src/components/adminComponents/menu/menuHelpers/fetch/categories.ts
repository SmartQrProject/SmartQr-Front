import { CategoryFormData } from "../schemas/createCategorySchema"

const APIURL = process.env.NEXT_PUBLIC_API_URL

// 


//https://smartqr-back.onrender.com/categories/restaurant/fecho-cafe?page=1&limit=10

export async function getCategories (slug: string, token: string) {
  try {
    const response = await fetch(`${APIURL}/categories/restaurant/${slug}?page=1&limit=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    return response.json();

  } catch (error: any) {
    throw new Error(error.message || "Error fetching categories");
  }
}



export async function createCategory (token: string, data: CategoryFormData, slug: string) {
    try {
        
        const response = await fetch(`${APIURL}/categories/restaurant/${slug}`,{
            method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
            body: JSON.stringify(data),
        })

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create category");
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false };
  }
}