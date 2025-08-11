"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ICartProduct } from "@/components/adminComponents/menu/menuTypes/menuTypes";
import {
  CreditCard,
  MinusCircle,
  PlusCircle,
  Receipt,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { CgClose } from "react-icons/cg";
import AddressInput from "@/components/adminComponents/maps/AddressInput";
import { getCustomerById } from "../fetch/customerUser";
import DeliveryAddressModal from "./ModalDeliveryAddress";

const CartView = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug ? String(params.slug) : "default-slug";
  const APIURL = process.env.NEXT_PUBLIC_API_URL;

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [totalCart, setTotalCart] = useState<number>(0);
  const [cart, setCart] = useState<ICartProduct[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [promoPercentage, setPromoPercentage] = useState<number | null>(null);
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<{ full: string; coords?: number[] } | null>(null);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);


  const discountAmount = promoPercentage ? (totalCart * promoPercentage) / 100 : 0;
  const finalTotal = totalCart - discountAmount;

  useEffect(() => {
    const session = localStorage.getItem("customerSession");
    if (session) {
    const parsed = JSON.parse(session);
    setCustomerId(parsed.payload?.id);
    setToken(parsed.token || null);
    }

    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]") as ICartProduct[];
    const cartWithQuantity = storedCart.map((product) => ({
      ...product,
      quantity: product.quantity ?? 1,
    }));
    setCart(cartWithQuantity);
    recalculateTotal(cartWithQuantity);

    const storedTableNumber = localStorage.getItem("tableNumber") || null;
    if (storedTableNumber?.includes("/")) {
      const clean = storedTableNumber.split("/")[0];
      localStorage.setItem("tableNumber", clean);
      setTableNumber(clean);
    } else {
      setTableNumber(storedTableNumber);
    }

    setLoadingSession(false);
  }, []);

  // traemos address de getcustomerById
  useEffect(() => {
    if (!customerId || !token) return;

    async function fetchCustomer() {
      const res = await getCustomerById(token!, slug, customerId!);
      if (res.success) {
        setCustomerData(res.data);

        localStorage.setItem(
          "customerSession",
          JSON.stringify({ token, payload: res.data })
        );
      }
    }

    fetchCustomer();
  }, [customerId, token, slug]);

  const recalculateTotal = (cartData: ICartProduct[]) => {
    const total = cartData.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    setTotalCart(total);
  };

  const updateQuantity = (id: string, quantity: number) => {
    const updatedCart = cart.map((product) =>
      product.id === id ? { ...product, quantity: Math.max(quantity, 1) } : product
    );
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
    if (loadingSession) {
      toast.loading("Checking login...");
      return;
    }

    if (!customerId) {
      toast.error("You must be logged in to checkout.");
      window.dispatchEvent(new CustomEvent("openHamburgerMenu"));
      return;
    }

     setIsRedirecting(true);

    const isDelivery = !tableNumber;
    let addressToUse = "";

    if (isDelivery) {
      if (useDefaultAddress) {
        addressToUse = customerData?.address?.full;

        if (!addressToUse) {
          toast.error("No default address found. Please enter one.");
          return;
        }
      } else {
        if (!selectedAddress?.full) {
          toast.error("Please enter a delivery address.");
          return;
        }
        addressToUse = selectedAddress.full;
      }
    }

    const productsForOrder = cart.map((product) => ({
      id: product.id,
      quantity: product.quantity,
    }));

    const orderPayload = {
      customerId,
      order_type: isDelivery ? "delivery" : "dine-in",
      code: isDelivery ? addressToUse : tableNumber || "counter",
      rewardCode: isPromoValid ? promoCode.trim() : undefined,
      products: productsForOrder,
    };

    const session = localStorage.getItem("customerSession");
    const token = session ? JSON.parse(session).token : null;
    if (!token) throw new Error("Missing auth token");

    try {
      const res = await fetch(`${APIURL}/${slug}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        setIsRedirecting(false);
        toast.error(data.message || "Order creation failed");
        return;
      }

      localStorage.setItem("cart", "[]");
      toast.success("Order created. Redirecting to payment...");

      if (!data.stripeSession) {
        setIsRedirecting(false);
        throw new Error("Missing Stripe session URL");
    }

      setTimeout(() => {
      window.location.href = data.stripeSession;
    }, 300);
    } catch (error: any) {
        setIsRedirecting(false);
      console.error("Checkout error:", error);
      toast.error(error.message || "Checkout failed.");
    }
  };
        if (isRedirecting) {
        return (
            <div className="flex items-center justify-center h-40 gap-3">
                <p className="text-lg text-branding-900"> Redirecting, please wait...</p>
                <div className="w-6 h-6 border-4 border-branding-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
        }

  return (
    <>
    

   <div className="p-4 md:min-h-screen">
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
       {/* Cart Section */}
       <div className="bg-white p-6 rounded-lg shadow-md">
         <h2 className="text-center text-2xl font-bold mb-4 flex gap-2 justify-center items-center">
            Products
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
                     <button onClick={() => updateQuantity(product.id, product.quantity - 1)} disabled={product.quantity <= 1} className="disabled:opacity-50">
                       <MinusCircle className="h-5 w-5 text-branding-500 hover:text-branding-600" />
                     </button>
                     <span className="font-semibold">{product.quantity}</span>
                     <button onClick={() => updateQuantity(product.id, product.quantity + 1)}>
                       <PlusCircle className="h-5 w-5 text-branding-500 hover:text-branding-600" />
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
           Order Summary
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
               className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-branding-500"
             />
             <button onClick={applyPromoCode} className="bg-branding-500 text-white px-4 py-2 rounded-lg hover:bg-branding-600 font-semibold cursor-pointer">
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
                onClick={() => {
                    if (!customerId) {
                    toast.error("You must be logged in to checkout.");
                    window.dispatchEvent(new CustomEvent("openHamburgerMenu"));
                    return;
                    }
                    setIsModalOpen(true);
                }}
                className="bg-branding-500 hover:bg-branding-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                <CreditCard className="h-6 w-6" /> Continue
            </button>

             <button onClick={() => router.push(`/menu/${slug}`)} className="text-branding-500 hover:bg-branding-600 hover:text-white hover:border-0 border-2 border-branding-500 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer">
               <ShoppingCart className="h-6 w-6" /> Continue Shopping
             </button>
           </div>
         )}
       </div>

      <DeliveryAddressModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            useDefaultAddress={useDefaultAddress}
            setUseDefaultAddress={setUseDefaultAddress}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            defaultAddress={customerData?.address?.full}
            onCheckout={handleCheckout}
            />
     </div>
     
   </div>
    </>
 );
};

export default CartView;
