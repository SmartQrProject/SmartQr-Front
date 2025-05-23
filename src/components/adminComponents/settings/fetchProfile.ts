import { UserProfileFormInputs } from "./SettingsSchema";


const APIURL = process.env.NEXT_PUBLIC_API_URL;


export async function updateProfile(token: string, data: UserProfileFormInputs, slug: string, userId: string) {
  try {
    // Preparar los datos para enviar
    const updateData = {
      name: data.name,
      phone: data.phone,
      address: data.address,
      // Solo incluir los campos de contraseña si se proporcionaron
      ...(data.password && {
        password: data.password,
        confirmPassword: data.confirmPassword
      })
    };

    const response = await fetch(`${APIURL}/users/${slug}/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update profile",
      };
    }

    return { success: true, data: result };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || "An unexpected error occurred" 
    };
  }
}

export async function getProfile(token: string, slug: string, userId: string) {
  try {
    const response = await fetch(`${APIURL}/users/staff?slug=${slug}&limit=100`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch profile");
    }

    const user = result.data.find((u: any) => u.id === userId);
    if (!user) {
      throw new Error("User not found in staff list");
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message || "Error fetching profile");
  }
} 