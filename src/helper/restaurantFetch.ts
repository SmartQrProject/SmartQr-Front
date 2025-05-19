import { IRestaurant } from "@/types";

export async function getRestaurant(slug: string): Promise<IRestaurant> {
  const session = localStorage.getItem("adminSession");

  if (!slug) throw new Error("Missing restaurant slug.");
  if (!session) throw new Error("Missing session in localStorage");

  const parsed = JSON.parse(session);
  const token = parsed.token;

  const APIURL = process.env.NEXT_PUBLIC_API_URL;
  if (!token || !APIURL) throw new Error("Missing token or API URL");

  const res = await fetch(`${APIURL}/restaurants?slug=${slug}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Fetch failed: ${res.status} ${error}`);
  }

  return await res.json();
}
