'use client';

import { useUser } from '@auth0/nextjs-auth0';

export default function AuthLinks() {
  const { user, isLoading } = useUser();

  if (isLoading) return null;

  return (
    <div className="flex justify-end mr-4 mt-4">
      {!user ? (
        <a
          href="/auth/login?returnTo=/customer/dashboard"
          className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Login as customer
        </a>
      ) : (
        <a
          href="/auth/logout"
          className="text-red-600 underline px-4 py-2 rounded-md hover:text-red-800 transition"
        >
          Logout
        </a>
      )}
    </div>
  );
}
