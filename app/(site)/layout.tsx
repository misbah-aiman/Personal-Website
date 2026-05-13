import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getContent();
  return (
    <>
      <Navbar site={content.site} />
      <main>{children}</main>
      <Footer site={content.site} />
    </>
  );
}
