import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Metadata } from "next";
import { Toaster } from "@workspace/ui/components/sonner";

export const metadata: Metadata = {
  title: "Cashvio Customer",
  description:
    "cashvio is a modern and powerful posst system for your business to manage your sales and inventory. Cashvio Customer help you to manage your history with registered shops.",
};

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>{children}</Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
