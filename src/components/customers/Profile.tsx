"use client";

import { useUser, getAccessToken } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import NavbarCustomer from "./navbarCustomer/NavbarCustomer";
import OrderHistory from "./historyOrder/OrderHistoryCustomer";
import Footer from "../subscribers/footer/Footer";
import { ClipboardList } from "lucide-react";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function CustomerProfile() {
    const { user, isLoading } = useUser();
    const params = useParams();

    const [slug, setSlug] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [sessionReady, setSessionReady] = useState(false);
    const [customerData, setCustomerData] = useState({name:"", picture:"", phone:""});

    useEffect(() => {
        const storedSlug = localStorage.getItem("slug");
        const paramSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

        setSlug(paramSlug || storedSlug || null);
        setMounted(true);
    }, [params?.slug]);

useEffect(() => {
  const syncUser = async () => {
    if (!user || !slug) return;

  

    try {
      const token = await getAccessToken();
      

      const res = await fetch(`${APIURL}/${slug}/customers/sincronizar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          auth0Id: user.sub,
          picture: user.picture,
        }),
      });

      if (!res.ok) {
        
        const errText = await res.text();
        console.error("Detalles:", errText);
        return;
      }

      const data = await res.json();
      console.log(data)

      const customerData = {
        name: data.name,
        picture: data.picture,
        phone: data.phone,
      }

      setCustomerData(customerData)
      const customerSession = {
        token: token,
        payload: {
          picture: customerData.picture,
          id: data?.id,
        },
      };

      localStorage.setItem("customerSession", JSON.stringify(customerSession));
      window.dispatchEvent(new Event("customerSessionUpdated"));
      
      setSessionReady(true);
      
    } catch (err) {
      console.error("Error syncing user:", err);
    }
  };

  syncUser();
}, [user, slug]);

    if (!mounted || isLoading) return <p className="text-center mt-20">Loading...</p>;
    if (!slug) return <p className="text-center mt-20">Error: Slug not available</p>;
    if (!user) return <p className="text-center mt-20">Not authenticated</p>;

    return (
        <>
            <NavbarCustomer />
            <h1 className="text-center text-2xl mt-20 font-bold mb-4 flex justify-center items-center gap-2">
                <ClipboardList className="h-7 w-7 text-sky-700" /> My Orders
            </h1>
            <h2 className="text-center text-xl ">Hi, {customerData.name}</h2>
            <div className="relative w-20 h-20 mx-auto mt-4 mb-6">
                {customerData.picture && (
                <img src={customerData.picture} alt="Foto" className="rounded-full w-20 h-20 object-cover" />
                )}
                <Link
                    href={`/customer/dashboard/edit`}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-200 flex items-center justify-center"
                    style={{ width: 28, height: 28 }}
                    aria-label="Editar perfil"
                    title="Editar perfil"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M16.5 3.75a2.121 2.121 0 113 3L7.5 18.75H4.5v-3L16.5 3.75z" />
                    </svg>
                </Link>
            </div>
            {sessionReady && <OrderHistory />}
            <Footer />
        </>
    );
}
