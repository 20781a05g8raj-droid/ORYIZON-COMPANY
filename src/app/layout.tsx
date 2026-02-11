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
  metadataBase: new URL("https://oryizon.com"),
  title: {
    default: "Organic Moringa Powder for Daily Health & Immunity | Oryizon",
    template: "%s | Oryizon",
  },
  description: "Premium organic moringa powder rich in vitamins, minerals & antioxidants. Boost immunity, energy & overall wellness naturally with Oryizon.",
  keywords: [
    "moringa powder", "organic moringa powder", "moringa benefits",
    "immunity booster", "natural superfood", "moringa for health",
    "moringa oleifera", "plant protein", "ayurvedic supplement",
    "daily wellness", "oryizon moringa", "moringa antioxidants",
    "buy moringa powder online", "best moringa powder India",
  ],
  authors: [{ name: "Oryizon" }],
  creator: "Oryizon",
  publisher: "Oryizon",
  alternates: {
    canonical: "https://oryizon.com",
  },
  openGraph: {
    title: "Organic Moringa Powder for Daily Health & Immunity | Oryizon",
    description: "Premium organic moringa powder rich in vitamins, minerals & antioxidants. Boost immunity, energy & overall wellness naturally with Oryizon.",
    url: "https://oryizon.com",
    siteName: "Oryizon",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/products/product-1.png",
        width: 1200,
        height: 630,
        alt: "Organic moringa powder by Oryizon for immunity and daily health",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Organic Moringa Powder for Daily Health & Immunity | Oryizon",
    description: "Premium organic moringa powder rich in vitamins, minerals & antioxidants. Boost immunity, energy & overall wellness naturally.",
    images: ["/images/products/product-1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
                      mutation.target.removeAttribute('bis_skin_checked');
                    }
                  });
                });
                observer.observe(document.documentElement, {
                  attributes: true,
                  subtree: true,
                  attributeFilter: ['bis_skin_checked']
                });
              })();
            `,
          }}
        />
        <ClientToaster />
        <Header />
        <CartDrawer />
        <main suppressHydrationWarning>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
