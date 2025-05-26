import { FormPromoCodes } from "./PromoCodesSchema";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function getPromoCodes(slug: string, token: string) {
  try {

    const response = await fetch(`${APIURL}/${slug}/reward-codes`, {
   method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    return response.json();

  } catch (error: any) {
    throw new Error(error.message || "Error fetching users");
  }
}



export async function createPromoCodes(token: string, data: FormPromoCodes, slug: string) {
  try {
    const response = await fetch(`${APIURL}/${slug}/reward-codes`, {
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
        message: result.message || "Failed to create PromoCodes"
      };
    }

    return { success: true };

  } catch (error: any) {

    return { success: false, message: "Unexpected error occurred" };
  }
}

export async function deletePromoCodes(token: string, id:string, slug: string) {
  try {
    const response = await fetch(`${APIURL}/${slug}/reward-codes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete PromoCodes"
      };
    }

    return { success: true };

  } catch (error: any) {

    return { success: false, message: "Unexpected error occurred" };
  }
}
