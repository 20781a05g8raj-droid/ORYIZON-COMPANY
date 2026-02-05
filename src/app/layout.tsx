import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ClientToaster } from "@/components/layout/ClientToaster";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ORYIZON - Premium Organic Moringa Powder | Natural Superfood",
  description: "Experience nature's most powerful superfood. Our certified organic Moringa powder delivers 90+ nutrients for energy, immunity, and total wellness. Free shipping over ₹499.",
  keywords: ["moringa", "moringa powder", "organic moringa", "superfood", "immunity booster", "natural supplement", "ayurvedic", "health food"],
  authors: [{ name: "ORYIZON" }],
  openGraph: {
    title: "ORYIZON - Premium Organic Moringa Powder",
    description: "Pure. Organic. Powerful. Experience nature's most nutrient-dense superfood.",
    url: "https://oryizon.com",
    siteName: "ORYIZON",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ORYIZON - Premium Organic Moringa Powder",
    description: "Pure. Organic. Powerful. Experience nature's most nutrient-dense superfood.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ClientToaster />
        <Header />
        <CartDrawer />
        <main suppressHydrationWarning>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
