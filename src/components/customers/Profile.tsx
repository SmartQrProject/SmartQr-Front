'use client';
import { useUser, getAccessToken } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CustomerProfile() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;

      try {
        const tokenResponse = await getAccessToken();
        const token = tokenResponse.accessToken;

        const res = await fetch('https://smartqr-back.onrender.com/customers/sincronizar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            auth0Id: user.sub,
            picture: user.picture,
          }),
        });

        if (!res.ok) throw new Error('Sync failed');
        console.log('✅ Usuario sincronizado con token');
      } catch (err) {
        console.error('❌ Error al sincronizar usuario:', err);
      }
    };

    syncUser();
  }, [user]);

  if (isLoading) return <p>Cargando...</p>;
  if (!user) return <p>No autenticado</p>;

  return (

    <>
    
        <div className="text-center mt-20">
        <img
            src={user.picture ?? ''}
            alt="Foto"
            className="rounded-full w-20 h-20 mx-auto"
        />
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p>{user.email}</p>
        </div>
        <Link href="/" className="bg-blue-500 text-white p-4 rounded-md     ">
        Home
        </Link>
    
    </>
  );
}
