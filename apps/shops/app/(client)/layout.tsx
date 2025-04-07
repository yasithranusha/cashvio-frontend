import { HeroHeader } from "@/components/client/layout/navbar"
import FooterSection from "@/components/client/layout/footer"

export default function ShopClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <HeroHeader />
      {children}
      <FooterSection />
    </div>
  )
}
