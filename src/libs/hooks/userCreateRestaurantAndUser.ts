import { toast } from "react-hot-toast";

export const userCreateRestaurantAndUser = () => {
  const create = async ({
    name,
    owner_email,
    owner_pass,
    slug,
  }: {
    name: string;
    owner_email: string;
    owner_pass: string;
    slug: string;
  }) => {
    const API = process.env.NEXT_PUBLIC_API_URL;
      console.log("🌍 API URL:", API); // New

      const restaurantPayload = {
        name,
        owner_email,
        owner_pass,
        slug,
      };

      console.log("🔍 Payload being sent:", restaurantPayload); // Moved here

      try {
        const res = await fetch(`${API}/restaurants/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(restaurantPayload),
        });

        console.log("📥 Response status:", res.status);

        const json = await res.json();
        console.log("📦 Parsed response body:", json);

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
        console.error("❌ Caught error during fetch or JSON parse:", err);
        toast.error(err.message || "❌ Something went wrong");
        throw err;
      }

  };

  return { create };
};
