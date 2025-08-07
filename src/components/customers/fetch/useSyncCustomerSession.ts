import { useUser, getAccessToken } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export function useSyncCustomerSession(slug: string | null) {
    const { user } = useUser();
    const [sessionReady, setSessionReady] = useState(false);

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
                        address: user.address ? {
                            full: user.address.full,
                            coords: user.address.coords,
                        } : undefined,
                        phone: user.phone,
                    }),
                });

                if (!res.ok) {
                    const errText = await res.text();
                    console.error("Detalles:", errText);
                    return;
                }

                const data = await res.json();

                const customerSession = {
                    token,
                    payload: {
                        picture: data.picture,
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

    return sessionReady;
}
