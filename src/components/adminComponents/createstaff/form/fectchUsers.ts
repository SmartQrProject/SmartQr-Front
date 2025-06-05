import { StaffFormInputs } from "./SchemaStaff";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function staffRegister(token: string, data: StaffFormInputs, slug: string) {
    const { phone, ...rest } = data;

    const preparedData = {
    ...rest,
    ...(phone !== undefined && phone !== null ? { phone: String(phone) } : {}),
    };
    try {
        const response = await fetch(`${APIURL}/users/${slug}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(preparedData),
        });
        // console.log(preparedData)
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

export async function getUsers(slug: string, token: string, page = 1, limit = 5) {
    try {
        const response = await fetch(`${APIURL}/users/staff?slug=${slug}&page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();

        return data;
    } catch (error: any) {
        throw new Error(error.message || "Error fetching users");
    }
}

export const deleteUser = async (slug: string, userId: string, token: string) => {
    const url = `${APIURL}/users/${slug}/${userId}`;

    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    const text = await res.text();

    let data;
    try {
        data = JSON.parse(text);
    } catch {
        data = text;
    }

    if (!res.ok) {
        const errMsg = (data && data.message) || data || "Failed to delete user";
        throw new Error(errMsg);
    }

    if (res.status === 204) return null;

    return data;
};
