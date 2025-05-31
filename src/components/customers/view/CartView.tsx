"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ICartProduct } from "@/components/adminComponents/menu/menuTypes/menuTypes";
import { CreditCard, MinusCircle, PlusCircle, Receipt, ShoppingCart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { CgClose } from "react-icons/cg";

const CartView = () => {
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug ? String(params.slug) : "default-slug";
    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    const [customerId, setCustomerId] = useState<string | null>(null);
    const [loadingSession, setLoadingSession] = useState(true);
    const [totalCart, setTotalCart] = useState<number>(0);
    const [cart, setCart] = useState<ICartProduct[]>([]);
    const [promoCode, setPromoCode] = useState("");
    const [isPromoValid, setIsPromoValid] = useState(false);
    const [promoPercentage, setPromoPercentage] = useState<number | null>(null);

    const discountAmount = promoPercentage ? (totalCart * promoPercentage) / 100 : 0;
    const finalTotal = totalCart - discountAmount;

    useEffect(() => {
        const session = localStorage.getItem("customerSession");
        if (session) {
            const parsed = JSON.parse(session);
            setCustomerId(parsed.payload?.id);
        }
        setLoadingSession(false);

        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]") as ICartProduct[];
        const cartWithQuantity = storedCart.map((product) => ({
            ...product,
            quantity: product.quantity ?? 1,
        }));
        setCart(cartWithQuantity);
        recalculateTotal(cartWithQuantity);
    }, []);

    const recalculateTotal = (cartData: ICartProduct[]) => {
        const total = cartData.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
        setTotalCart(total);
    };

    const updateQuantity = (id: string, quantity: number) => {
        const updatedCart = cart.map((product) => (product.id === id ? { ...product, quantity: Math.max(quantity, 1) } : product));
        setCart(updatedCart);
        recalculateTotal(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const removeFromCart = (idToRemove: string) => {
        const updatedCart = cart.filter((product) => product.id !== idToRemove);
        setCart(updatedCart);
        recalculateTotal(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const applyPromoCode = async () => {
        if (!promoCode || !slug) {
            toast.error("Please enter a promo code.");
            return;
        }

        try {
            const res = await fetch(`${APIURL}/${slug}/reward-codes/code/${promoCode.trim()}`);
            if (res.status === 404) {
                toast.error("Invalid or expired promo code.");
                return;
            }
            if (!res.ok) throw new Error("Failed to validate promo code");

            const matchedCode = await res.json();
            setIsPromoValid(true);
            setPromoPercentage(matchedCode.percentage);
            toast.success(`Promo applied! ${matchedCode.percentage}% discount.`);
        } catch (err) {
            console.error(err);
            toast.error("Error validating promo code.");
        }
    };

    const handleCheckout = async () => {
        const table = localStorage.getItem("tableNumber") || "00";
        const paddedTable = table.padStart(2, "0");
        const code = `${paddedTable}`;
        if (loadingSession) {
            toast.loading("Checking login...");
            return;
        }

        if (!customerId) {
            toast.error("You must be logged in to checkout.");
            const event = new CustomEvent("openHamburgerMenu");
            window.dispatchEvent(event);
            return;
        }

        try {
            const productsForOrder = cart.map((product) => ({
                id: product.id,
                quantity: product.quantity,
            }));

            const orderPayload = {
                customerId,
                code,
                rewardCode: isPromoValid ? promoCode.trim() : undefined,
                products: productsForOrder,
            };

            const session = localStorage.getItem("customerSession");
            const token = session ? JSON.parse(session).token : null;
            if (!token) throw new Error("Missing auth token");

            if (orderPayload.code === "00") {
                orderPayload.code = "counter";
            }
            const res = await fetch(`${APIURL}/${slug}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(orderPayload),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Order creation failed");
                return;
            }

            localStorage.setItem("cart", "[]");
            toast.success("Order created. Redirecting to payment...");
            if (!data.stripeSession) throw new Error("Missing Stripe session URL");

            window.location.href = data.stripeSession;
        } catch (error: any) {
            console.error("Checkout error:", error);
            toast.error(error.message || "Checkout failed.");
        }
    };

    return (
        <div className="p-4 md:min-h-screen bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-center text-2xl font-bold mb-4 flex gap-2 justify-center items-center">
                        <ShoppingCart className="h-6 w-6 text-sky-600" /> Products
                    </h2>

                    <div className="grid gap-4">
                        {cart.length === 0 ? (
                            <p className="text-lg text-gray-600 text-center">Your cart is empty.</p>
                        ) : (
                            cart.map((product) => (
                                <div key={product.id} className="shadow-sm rounded-md p-4 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50">
                                    <div className="w-full sm:w-24 h-24 flex-shrink-0">
                                        <img src={product.image_url as string} alt={product.name} className="w-full h-full object-cover rounded-md" />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <p className="text-lg font-medium">{product.name}</p>
                                        <p className="text-gray-600 text-sm">${Number(product.price).toFixed(2)}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <button
                                                onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                                disabled={product.quantity <= 1}
                                                className="disabled:opacity-50"
                                            >
                                                <MinusCircle className="h-5 w-5 text-sky-700 hover:text-sky-500" />
                                            </button>
                                            <span className="font-semibold">{product.quantity}</span>
                                            <button onClick={() => updateQuantity(product.id, product.quantity + 1)}>
                                                <PlusCircle className="h-5 w-5 text-sky-700 hover:text-sky-500" />
                                            </button>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(product.id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-center text-2xl font-bold mb-4 flex gap-2 justify-center items-center">
                        <Receipt className="h-6 w-6 text-sky-600" /> Order Summary
                    </h2>

                    <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Subtotal:</span>
                        <span>${totalCart.toFixed(2)}</span>
                    </div>

                    {isPromoValid && promoPercentage && (
                        <div className="flex justify-between mb-2 text-green-600 font-medium">
                            <span>Discount ({promoPercentage}%):</span>
                            <span>- ${discountAmount.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="flex justify-between font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>${finalTotal.toFixed(2)}</span>
                    </div>

                    {/* Promo Code */}
                    <div className="mt-4">
                        <label className="block mb-1 font-medium text-gray-700">Promo Code</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="Enter code"
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                            <button onClick={applyPromoCode} className="bg-sky-700 text-white px-4 py-2 rounded-lg hover:bg-sky-600 font-semibold cursor-pointer">
                                Apply
                            </button>
                        </div>
                    </div>

                    {isPromoValid && (
                        <div className="flex items-center justify-between text-green-700 font-semibold mt-2">
                            <span>Promo "{promoCode}" applied</span>
                            <button
                                onClick={() => {
                                    setPromoCode("");
                                    setIsPromoValid(false);
                                    setPromoPercentage(null);
                                    toast("Promo code removed.");
                                }}
                                className="ml-2 text-red-500 hover:text-red-700 text-sm"
                                title="Remove promo code"
                            >
                                <CgClose className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    {cart.length > 0 && (
                        <div className="mt-6 flex flex-col gap-2">
                            <button
                                onClick={handleCheckout}
                                className="bg-sky-700 hover:bg-sky-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <CreditCard className="h-6 w-6" /> Proceed to Checkout
                            </button>

                            <button
                                onClick={() => router.push(`/menu/${slug}`)}
                                className="text-sky-700 hover:bg-sky-600 hover:text-white hover:border-0 border-2 border-sky-700 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <ShoppingCart className="h-6 w-6" /> Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartView;
