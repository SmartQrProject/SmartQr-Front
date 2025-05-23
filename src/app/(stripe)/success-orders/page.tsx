'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function SuccessOrderPage() {
  const router = useRouter();

  useEffect(() => {
    const pendingOrderRaw = localStorage.getItem('pendingOrder');

    if (!pendingOrderRaw) {
      toast.error('❌ No order found. Please try again.');
      router.push('/');
      return;
    }

    const { customerId, code, products, slug } = JSON.parse(pendingOrderRaw);

    if (!customerId || !slug || !products?.length) {
      toast.error('⚠️ Incomplete order data. Please try again.');
      localStorage.removeItem('pendingOrder');
      router.push('/');
      return;
    }

    const sendOrder = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${slug}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerId, code, products }),
        });

        if (!res.ok) throw new Error(`Backend responded with ${res.status}`);

        localStorage.removeItem('pendingOrder');
        localStorage.setItem('cart', '[]');
        toast.success('✅ Order placed successfully!');

        router.push(`/menu/${slug}/confirmation`);
      } catch (err) {
        console.error('❌ Error sending order:', err);
        toast.error('Could not submit order. Please contact staff.');
        router.push(`/menu/${slug}/cart`);
      }
    };

    sendOrder();
  }, [router]);

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold text-green-700">🎉 Payment Successful</h2>
      <p className="mt-2 text-gray-600">Sending your order to the kitchen...</p>
    </div>
  );
}
