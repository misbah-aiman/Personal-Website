import { NextResponse, type NextRequest } from "next/server";
import {
  checkPassword,
  createSessionToken,
  COOKIE_NAME,
  SESSION_TTL_SECONDS,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let payload: { password?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!checkPassword(payload.password)) {
    // Tiny artificial delay to slow brute-force.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json(
      { error: "Incorrect password" },
      { status: 401 },
    );
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
