import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth0"; // Asegurate que esta ruta sea la correcta

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const isProtectedRoute =
    pathname === "/dashboard" ||
    pathname === "/cart" ||
    pathname === "/orders" ||
    pathname === "/createcategory" ||
    pathname === "/createproduct" ||
    pathname === "/deleteproduct" ||
    pathname === "/modifyproduct" ||
    pathname === "/tables";

  const session = request.cookies.get("adminSession")?.value;

  if (isProtectedRoute && !session) {
    const loginUrl = new NextURL("/login", origin);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const result = await auth0.middleware(request);
    return result;
  } catch (err) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
