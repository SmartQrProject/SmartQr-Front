import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
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
