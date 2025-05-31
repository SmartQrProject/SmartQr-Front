import { toast } from "react-hot-toast";

export const useCreateOrder = () => {
    const create = async ({ customerId, code, products }: { customerId: string; code: string; products: { id: string; quantity: number }[] }) => {
        const APIURL = process.env.NEXT_PUBLIC_API_URL;
        const session = localStorage.getItem("customerSession");
        const token = session ? JSON.parse(session).token : null;
        const slug = localStorage.getItem("slug");

        try {
            const res = await fetch(`${APIURL}/${slug}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ customerId, code, products }),
            });
            // console.log("🔍 Order creation response:", { customerId, code, products } );
            // console.log(token);

            const data = await res.json();

            if (!res.ok) {
                console.error("❌ Order creation failed:", data);
                throw new Error(data.message || "Failed to create order");
            }

            return data;
        } catch (err: any) {
            console.error("❌ Error creating order:", err);
            toast.error(err.message || "Order creation error");
            throw err;
        }
    };

    return { create };
};
