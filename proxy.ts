import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  /*
  Define protected and auth routes
  - Open routes: accessible to everyone
  - Auth routes: accessible only to unauthenticated users
  - Protected routes: accessible only to authenticated users
  */

  const openUrls = ["/"];
  const authUrls = ["/signin", "/signup"];

  if (session && authUrls.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!session && openUrls.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!session && !authUrls.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"], // Protect all routes except static, api, etc.
};