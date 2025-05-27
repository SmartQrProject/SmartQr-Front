"use client";

export default function SuccessPage() {
  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-semibold">🎉 Thank you for your payment!</h2>
      <p className="mt-4 text-gray-700">
        Your restaurant is being activated. You can now log in and start managing your store.
      </p>

      <div className="mt-6">
        <a
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
