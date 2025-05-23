const APIURL = process.env.NEXT_PUBLIC_API_URL

interface CustomerData {
  name?: string;
  email?: string;
  phone?: string;
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
    const response = await fetch(`${APIURL}/${slug}/customers/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse?.message || `Failed to fetch customer (status: ${response.status})`);
    }

    return await response.json();

  } catch (error: any) {
    throw new Error(error?.message || "Unexpected error occurred");
  }
}