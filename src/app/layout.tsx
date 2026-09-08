import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ClientToaster } from "@/components/layout/ClientToaster";
import { LoadingScreenWrapper } from "@/components/layout/LoadingScreenWrapper";
import { CustomCursorWrapper } from "@/components/layout/CustomCursorWrapper";
import { SmoothScrollWrapper } from "@/components/layout/SmoothScrollWrapper";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oryizon.com"),
  title: {
    default: "Buy 100% Pure Organic Moringa Powder Online | Best Price | Oryizon",
    template: "%s | Oryizon",
  },
  description: "Buy 100% pure organic moringa powder online at best price. Fresh moringa leaf powder (100g, 250g, 500g) sourced from organic farms. Fast delivery across India, Bihar & Nepal. Order now!",
  keywords: [
    "Buy organic moringa powder online",
    "Pure moringa leaf powder 250g",
    "Moringa powder 500g",
    "Best organic moringa powder price",
    "Moringa powder in Nepal",
    "Moringa powder in Bihar",
    "Moringa powder India",
    "100% pure organic moringa powder",
    "organic moringa oleifera leaf powder",
    "moringa powder benefits",
    "moringa powder price",
    "pure moringa leaf powder 250g 500g",
    "moringa immunity booster",
    "moringa superfood online",
    "buy moringa powder online India",
    "moringa powder Patna Bihar",
    "moringa powder Kathmandu Nepal",
  ],
  authors: [{ name: "Oryizon" }],
  creator: "Oryizon",
  publisher: "Oryizon",
  alternates: {
    canonical: "https://oryizon.com",
  },
  openGraph: {
    title: "Buy 100% Pure Organic Moringa Powder Online | Best Price | Oryizon",
    description: "Buy 100% pure organic moringa powder online at best price. Fresh moringa leaf powder (100g, 250g, 500g) sourced from organic farms. Fast delivery across India, Bihar & Nepal. Order now!",
    url: "https://oryizon.com",
    siteName: "Oryizon",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/products/product-1.png",
        width: 1200,
        height: 630,
        alt: "Buy 100% Pure Organic Moringa Powder online - Oryizon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy 100% Pure Organic Moringa Powder Online | Oryizon",
    description: "Buy 100% pure organic moringa powder online at best price. Delivering across India, Bihar & Nepal.",
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
    google: "nG-qaoOchoYSHUZ9p6C3CWTMYoB4yeV_gNc1GcXPRqM",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://oryizon.com/#organization",
      "name": "Oryizon",
      "url": "https://oryizon.com",
      "logo": "https://oryizon.com/images/oryizon-logo.png",
      "sameAs": [
        "https://www.instagram.com/oryizon",
        "https://www.facebook.com/oryizon"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91 8969124404",
        "contactType": "Customer Support",
        "areaServed": ["IN", "NP"],
        "availableLanguage": ["English", "Hindi"]
      },
      "description": "Premium 100% Pure Organic Moringa Powder producer delivering across India, Bihar & Nepal."
    },
    {
      "@type": "WebSite",
      "@id": "https://oryizon.com/#website",
      "url": "https://oryizon.com",
      "name": "Oryizon - Pure Organic Moringa Superfood",
      "publisher": {
        "@id": "https://oryizon.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://oryizon.com/products?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
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
        <LoadingScreenWrapper />
        <CustomCursorWrapper />
        <SmoothScrollWrapper>
          <Header />
          <CartDrawer />
          <main suppressHydrationWarning>{children}</main>
          <Footer />
        </SmoothScrollWrapper>
      </body>
    </html>
  );
}
