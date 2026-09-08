import type { Metadata } from 'next';
import { getProductBySlug as getLocalProductBySlug, products as localProducts } from '@/data/products';
import { getProductBySlug } from '@/lib/api/products';
import { ProductDetailClient } from '@/components/products/ProductDetailClient';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Fetch product data
    let product = await getProductBySlug(slug).catch(() => null);
    if (!product) {
        product = (getLocalProductBySlug(slug) as any) || null;
    }

    if (!product) {
        return {
            title: 'Product Not Found | Oryizon',
            description: 'The requested organic moringa product could not be found.',
        };
    }

    // High-CTR, search-intent driven title matching trending searches
    let seoTitle = `Buy 100% Pure Organic Moringa Powder Online | Best Price | Oryizon`;
    const lowerSlug = slug.toLowerCase();
    const lowerName = product.name.toLowerCase();

    if (lowerSlug.includes('250g') || lowerName.includes('250g')) {
        seoTitle = `Buy 100% Pure Organic Moringa Powder (250g) Online | Oryizon`;
    } else if (lowerSlug.includes('500g') || lowerName.includes('500g')) {
        seoTitle = `Buy Pure Organic Moringa Powder (500g Value Combo) Online | Oryizon`;
    } else if (lowerSlug.includes('100g') || lowerName.includes('100g')) {
        seoTitle = `Buy 100% Pure Organic Moringa Powder (100g) Online | Oryizon`;
    } else if (lowerSlug.includes('capsule')) {
        seoTitle = `Buy Organic Moringa Capsules Online | Best Price | Oryizon`;
    } else if (lowerSlug.includes('tea')) {
        seoTitle = `Buy Organic Moringa Herbal Tea Online | Detox & Immunity | Oryizon`;
    }

    const price = Number(product.price) || 299;
    const seoDescription = `Buy ${product.name} online at best price (₹${price}). 100% pure organic moringa leaf powder with fast delivery across India, Bihar & Nepal. Lab tested, antioxidant rich & certified organic. Order now!`;

    const productImages = product.images && product.images.length > 0
        ? product.images.map((img: string) => {
            if (img.startsWith('http') || img.startsWith('/')) return img;
            return `https://oryizon.com/images/products/${img}`;
        })
        : ['https://oryizon.com/images/products/product-1.png'];

    const canonicalUrl = `https://oryizon.com/products/${slug}`;

    return {
        title: seoTitle,
        description: seoDescription,
        keywords: [
            "Buy organic moringa powder online",
            "Pure moringa leaf powder 250g",
            "Moringa powder 500g",
            "Best organic moringa powder price",
            "Moringa powder in Nepal",
            "Moringa powder in Bihar",
            "Moringa powder India",
            "100% pure organic moringa powder",
            "organic moringa leaf powder price",
            "moringa powder Patna Bihar",
            "moringa powder Kathmandu Nepal",
            "buy moringa powder online India",
            "natural immunity booster superfood",
            product.name,
        ],
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: seoTitle,
            description: seoDescription,
            url: canonicalUrl,
            siteName: 'Oryizon',
            locale: 'en_IN',
            type: 'website',
            images: [
                {
                    url: productImages[0],
                    width: 1000,
                    height: 1000,
                    alt: seoTitle,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: seoTitle,
            description: seoDescription,
            images: [productImages[0]],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;

    let product = await getProductBySlug(slug).catch(() => null);
    if (!product) {
        product = (getLocalProductBySlug(slug) as any) || null;
    }

    const price = product ? Number(product.price) : 299;
    const productName = product ? product.name : 'Organic Moringa Powder';
    const productDesc = product?.description || '100% Pure Organic Moringa Leaf Powder';
    const productImages = product?.images && product.images.length > 0
        ? product.images.map((img: string) => img.startsWith('http') || img.startsWith('/') ? img : `https://oryizon.com/images/products/${img}`)
        : ['https://oryizon.com/images/products/product-1.png'];

    // Google Rich Snippets JSON-LD Structured Data
    const productJsonLd = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: productName,
        image: productImages,
        description: productDesc,
        sku: `ORY-${slug.toUpperCase()}`,
        mpn: `ORYIZON-${slug.toUpperCase()}`,
        brand: {
            '@type': 'Brand',
            name: 'Oryizon',
        },
        offers: {
            '@type': 'Offer',
            url: `https://oryizon.com/products/${slug}`,
            priceCurrency: 'INR',
            price: price,
            priceValidUntil: '2027-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'Oryizon',
            },
            shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: {
                    '@type': 'MonetaryAmount',
                    value: 0,
                    currency: 'INR',
                },
                shippingDestination: [
                    {
                        '@type': 'DefinedRegion',
                        addressCountry: 'IN',
                    },
                    {
                        '@type': 'DefinedRegion',
                        addressCountry: 'NP',
                    },
                ],
                deliveryTime: {
                    '@type': 'ShippingDeliveryTime',
                    handlingTime: {
                        '@type': 'QuantitativeValue',
                        minValue: 0,
                        maxValue: 1,
                        unitCode: 'DAY',
                    },
                    transitTime: {
                        '@type': 'QuantitativeValue',
                        minValue: 2,
                        maxValue: 5,
                        unitCode: 'DAY',
                    },
                },
            },
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '124',
            bestRating: '5',
            worstRating: '1',
        },
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://oryizon.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Products',
                item: 'https://oryizon.com/products',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: productName,
                item: `https://oryizon.com/products/${slug}`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ProductDetailClient initialSlug={slug} />
        </>
    );
}
