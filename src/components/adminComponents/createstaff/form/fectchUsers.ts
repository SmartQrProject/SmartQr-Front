import { StaffFormInputs } from "./SchemaStaff";

const APIURL = process.env.NEXT_PUBLIC_API_URL


export async function staffRegister (token: string, data: StaffFormInputs, slug: string) {
  try {
    const response = await fetch(`${APIURL}/users/${slug}/signup`, {
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
        message: result.message || "Failed to create Staff user",
      };
    }

    return { success: true };

  } catch (error: any) {

    return { success: false, message: "Unexpected error occurred" };
  }
}

export async function getUsers (slug: string, token: string) {
  try {
    const response = await fetch(`${APIURL}/users/staff?slug=${slug}&page=1&limit=5`, {
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


export const deleteUser = async (slug: string, userId: string, token: string) => {
  const url = `${APIURL}/users/${slug}/${userId}`;
  console.log("Deleting user with URL:", url);

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json',
    },
  });

  console.log("Respuesta status:", res.status);

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  console.log("Respuesta body:", data);

  if (!res.ok) {
    const errMsg = (data && data.message) || data || 'Failed to delete user';
    throw new Error(errMsg);
  }

  if (res.status === 204) return null;

  return data;
};
