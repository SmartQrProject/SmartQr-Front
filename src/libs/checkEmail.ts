const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function checkEmail(email: string): Promise<{ exists: boolean }> {
  const res = await fetch(`${APIURL}/users/check-email?email=${encodeURIComponent(email)}`);
  if (!res.ok) {
    throw new Error('Email verification failed');
  }
  return res.json();
}
