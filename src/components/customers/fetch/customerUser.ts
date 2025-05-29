const APIURL = process.env.NEXT_PUBLIC_API_URL

interface CustomerData {
  name?: string;
  email?: string;
  phone?: number;
  password?: string;
  reward?: number;
}

export async function modifyCustomersData(
  slug: string,
  token: string,
  id: string,
  data: CustomerData
) {
  try {
    const response = await fetch(`${APIURL}/${slug}/customers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result?.message || `Failed to modify user (status: ${response.status})`,
      };
    }

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error?.message || "Unexpected error occurred" };
  }
}



export async function getCustomerById(token: string, slug: string, id: string) {
  try {
  
    const url = `${APIURL}/${slug}/customers/${id}`;
   

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || typeof data !== "object") {
      throw new Error("No valid response data received from server.");
    }

    return { success: true, data };
  } catch (error: any) {
    // console.error("❌ Error fetching customer by ID:", error);
    return { success: false, message: error.message };
  }
}