import { NextResponse, type NextRequest } from "next/server";
import { getContent, saveContent } from "@/lib/storage";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import type { Content } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: Content;
  try {
    body = (await req.json()) as Content;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const saved = await saveContent(body);
  return NextResponse.json({ ok: true, content: saved });
}
