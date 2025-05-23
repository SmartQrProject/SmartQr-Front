"use client";
import { useUser, getAccessToken } from "@auth0/nextjs-auth0";
import { useEffect } from "react";
import Dashboard from "./view/Dashboard";
import { useParams } from "next/navigation";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function CustomerProfile() {
  const { user, isLoading } = useUser();
  const params = useParams();

  const storedSlug =
    typeof window !== "undefined" ? localStorage.getItem("slug") : null;
  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug || storedSlug;

  if (!slug) {
    // console.error("❌ Slug no encontrado ni en URL ni en localStorage.");
    return <p>Error: Slug no disponible</p>;
  }

  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;

      try {
        const token = await getAccessToken();
        console.log("🔍 Token:", token);

        const res = await fetch(`${APIURL}/${slug}/customers/sincronizar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            sub: user.sub,
            picture: user.picture,
          }),
        });
        const data = await res.json();

        console.log("Response:", data);

        const customerSession = {
          token: data?.auth0Id,
          payload: {
            id: data?.id,
          },
        };

        console.log("customerSession:", customerSession);

        if (!res.ok) throw new Error("Sync failed");
      } catch (err) {
        console.error("❌ Error al sincronizar usuario:", err);
      }
    };

    syncUser();
  }, [user, slug]);

  if (isLoading) return <p>Cargando...</p>;
  if (!user) return <p>No autenticado</p>;

  return (
    <>
      <div className="text-center mt-20">
        <img
          src={user.picture ?? ""}
          alt="Foto"
          className="rounded-full w-20 h-20 mx-auto"
        />
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p>{user.email}</p>
      </div>
      <Dashboard user={user} />
    </>
  );
}
