import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const ok = await verifySessionToken(token);
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
