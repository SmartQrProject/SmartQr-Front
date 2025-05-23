'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ICartProduct } from "@/components/adminComponents/menu/menuTypes/menuTypes";
import { CreditCard, Receipt, ShoppingCart } from 'lucide-react';
import { FaMoneyBill } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useCustomerAuth } from '../context/customerContext';

const CartView = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug ? String(params.slug) : 'default-slug';
  const { customer } = useCustomerAuth();
  const APIURL = process.env.NEXT_PUBLIC_API_URL; 

  const [totalCart, setTotalCart] = useState<number>(0);
  const [cart, setCart] = useState<ICartProduct[]>([]);

  useEffect(() => {
  try {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]") as ICartProduct[];
    const cartWithQuantity = storedCart.map((product) => ({
      ...product,
      quantity: product.quantity ?? 1,
    }));
    setCart(cartWithQuantity);
    recalculateTotal(cartWithQuantity);
  } catch (err) {
    console.error("Failed to load cart from localStorage:", err);
    setCart([]);
  }
  }, []);


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

  const handleCheckout = async () => {
    if (!customer?.payload?.id) {
      toast.error("You must be logged in to checkout.");
      return;
    }

    try {
      const productsForOrder = cart.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      }));

      const pendingOrder = {
        customerId: customer.payload.id,
        code: "T07", 
        products: productsForOrder,
        slug,
      };

      localStorage.setItem("pendingOrder", JSON.stringify(pendingOrder));

      const res = await fetch(`${APIURL}/stripe/checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total: totalCart * 100 }), 
      });

      const data = await res.json();

      if (!data.url) throw new Error("Stripe session creation failed");
      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Could not start checkout. Please try again.");
    }
  };

  return (
    <div className="p-4 md:min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-center text-2xl font-bold mb-4 flex gap-2 justify-center items-center">
            <ShoppingCart className='h-6 w-6 text-sky-600' /> Products
          </h2>
          <div className="grid gap-4">
            {cart.length === 0 ? (
              <p className="text-lg text-gray-600 text-center">Your cart is empty.</p>
            ) : (
              cart.map((product) => (
                <div key={product.id} className="border rounded-md p-4 flex flex-col gap-3 sm:flex-row justify-between items-center">
                  <div className="flex-1">
                    <p className="text-lg font-medium">{product.name}</p>
                    <p className="text-gray-600">${product.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(product.id, product.quantity - 1)}
                        disabled={product.quantity <= 1}
                        className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, product.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="w-24 h-24">
                    <img src={product.image_url as string} alt={product.name} className="w-full h-full object-cover rounded-md" />
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-red-500 hover:text-red-700 font-semibold mt-2 sm:mt-0"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-center text-2xl font-bold mb-4 flex gap-2 justify-center items-center">
            <Receipt className='h-6 w-6 text-sky-600' /> Order Summary
          </h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Subtotal:</span>
            <span>${totalCart.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total:</span>
            <span>${totalCart.toFixed(2)}</span>
          </div>
          {cart.length > 0 && (
            <div className="mt-6 flex flex-col gap-4">
              <button
                onClick={handleCheckout}
                className="bg-sky-700 hover:bg-sky-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <CreditCard className='h-6 w-6' /> Proceed to Checkout
              </button>
              <button className="text-sky-700 hover:bg-sky-600 hover:text-white border border-sky-700 py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
                <FaMoneyBill className='h-6 w-6' /> Pay at the Table
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartView;
