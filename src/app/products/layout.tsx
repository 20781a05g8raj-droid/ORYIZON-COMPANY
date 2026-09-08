import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Buy 100% Pure Organic Moringa Powder Online (100g, 250g, 500g) | Oryizon',
    description: 'Shop 100% pure organic moringa leaf powder online at best prices. Available in 100g, 250g & 500g value packs. Fast delivery across India, Bihar & Nepal. Lab tested & certified organic.',
    keywords: [
        'Buy organic moringa powder online',
        'Pure moringa leaf powder 250g',
        'Moringa powder 500g',
        'Best organic moringa powder price',
        'Moringa powder in Nepal',
        'Moringa powder in Bihar',
        'Moringa powder India',
        '100% pure organic moringa powder',
        'organic moringa oleifera leaf powder',
        'buy moringa powder online India',
    ],
    alternates: {
        canonical: 'https://oryizon.com/products',
    },
    openGraph: {
        title: 'Buy 100% Pure Organic Moringa Powder Online | Best Price | Oryizon',
        description: 'Shop 100% pure organic moringa leaf powder online. Available in 100g, 250g, 500g packs with delivery across India, Bihar & Nepal.',
        url: 'https://oryizon.com/products',
        siteName: 'Oryizon',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
