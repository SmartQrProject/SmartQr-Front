"use client";
import { useUser, getAccessToken } from "@auth0/nextjs-auth0";
import { useEffect } from "react";
import Dashboard from "./view/Dashboard";
import { useParams } from "next/navigation";
import { useCustomerAuth } from "./context/customerContext";


const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function CustomerProfile() {
  const { user, isLoading } = useUser();
  const { setCustomer } = useCustomerAuth(); // ✅ Use context
  const params = useParams();

  const storedSlug =
    typeof window !== "undefined" ? localStorage.getItem("slug") : null;
  const slug =
    Array.isArray(params?.slug) ? params.slug[0] : params?.slug || storedSlug;

  useEffect(() => {
  const syncUser = async () => {
    if (!user || !slug) return;

    const tokenRes = await getAccessToken();
    const token = tokenRes?.accessToken;

    if (!token) {
      console.warn("❌ No token received from Auth0");
      return;
    }

    const res = await fetch(`${APIURL}/${slug}/customers/sincronizar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        picture: user.picture,
        auth0Id: user.sub,
      }),
    });

    const data = await res.json();
    console.log("✅ Synced user:", data);

    const customerSession = {
      token,
      payload: {
        id: data?.id,
        sub: user.sub,
      },
    };

    localStorage.setItem("customerSession", JSON.stringify(customerSession));
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
