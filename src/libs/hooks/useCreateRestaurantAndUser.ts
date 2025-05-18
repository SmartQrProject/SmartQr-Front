import { toast } from "react-hot-toast";

export const useCreateRestaurantAndUser = () => {
  const create = async ({
    storeName,
    email,
    password,
    slug,
  }: {
    storeName: string;
    email: string;
    password: string;
    slug: string;
  }) => {
    const API = process.env.NEXT_PUBLIC_API_URL;

    const restaurantPayload = {
      name: storeName.trim(),
      slug: slug.trim().toLowerCase().replace(/[^a-z0-9\-]/g, "-"),
      owner_email: email.trim(),
      owner_pass: password,
    };

    try {
      console.log("📤 Creating restaurant:", restaurantPayload);

      const res = await fetch(`${API}/restaurants/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurantPayload),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("❌ Restaurant creation failed:", json);
        let msg = json.message || "Error creating the restaurant";
        if (msg.includes("ya registrado")) {
          msg = "This restaurant name is already registered";
        }
        throw new Error(msg);
      }

      toast.success("🎉 Register completed");
    } catch (err: any) {
      toast.error(err.message || "❌ Something went wrong");
      throw err;
    }
  };

  return { create };
};
