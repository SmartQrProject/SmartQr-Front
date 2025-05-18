import { CategoryFormData } from "../schemas/createCategorySchema"

const APIURL = process.env.NEXT_PUBLIC_API_URL

export async function getCategories (slug: string, token: string) {
  try {
    const response = await fetch(`${APIURL}/${slug}/categories?page=1&limit=10`, {
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
    const response = await fetch(`${APIURL}/${slug}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to create category"
      };
    }

    return { success: true };

  } catch (error: any) {

    return { success: false, message: "Unexpected error occurred" };
  }
}