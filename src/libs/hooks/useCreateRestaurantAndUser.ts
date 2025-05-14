import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export const useCreateRestaurantAndUser = () => {
  const router = useRouter();

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
      const restRes = await fetch(`${API}/restaurants/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurantPayload),
      });

      const restJson = await restRes.json();
      if (!restRes.ok) {
        console.error("❌ Restaurant creation failed", restJson);
        let msg = restJson.message || "Error creating the restaurant";
        if (msg.includes("ya registrado")) {
          msg = "Este restaurante ya está registrado.";
        }
        throw new Error(msg);
      }

      toast.success("🎉 Registro completado con éxito");
      localStorage.removeItem("pendingRestaurant");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "❌ Algo salió mal");
      setTimeout(() => router.push("/signup"), 3000);
    }
  };

  return { create };
};