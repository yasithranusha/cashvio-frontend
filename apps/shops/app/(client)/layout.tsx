import { HeroHeader } from "@/components/client/layout/navbar";
import FooterSection from "@/components/client/layout/footer";
import { getSession } from "@/lib/session";

export default async function ShopClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  const user = session?.user;
  return (
    <div>
      <HeroHeader user={user} />
      {children}
      <FooterSection />
    </div>
  );
}
