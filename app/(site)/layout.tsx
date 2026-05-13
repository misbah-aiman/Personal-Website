import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/storage";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getContent();
  const token = cookies().get(COOKIE_NAME)?.value;
  const isAdmin = await verifySessionToken(token);
  return (
    <>
      <Navbar site={content.site} isAdmin={isAdmin} />
      <main>{children}</main>
      <Footer site={content.site} />
    </>
  );
}
