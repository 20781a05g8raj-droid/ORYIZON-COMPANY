import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Organic Moringa Health, Diet & Wellness Blog | Oryizon',
    description: 'Explore research-backed guides on organic moringa powder benefits, moringa water routines, healthy recipes, and where to buy pure moringa leaf powder online across India, Bihar & Nepal.',
    keywords: [
        'Buy organic moringa powder online',
        'Pure moringa leaf powder 250g',
        'Moringa powder 500g',
        'Best organic moringa powder price',
        'Moringa powder in Nepal',
        'Moringa powder in Bihar',
        'moringa health benefits',
        'moringa daily routine',
        'moringa water benefits',
    ],
    alternates: {
        canonical: 'https://oryizon.com/blog',
    },
    openGraph: {
        title: 'Organic Moringa Health, Diet & Wellness Blog | Oryizon',
        description: 'Science-backed guides on organic moringa benefits, daily diet, and recipes. Sourced pure from certified organic farms.',
        url: 'https://oryizon.com/blog',
        siteName: 'Oryizon',
        locale: 'en_IN',
        type: 'website',
    },
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
