import React from 'react';

// FAQ Schema for homepage FAQs
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What are the benefits of moringa powder?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Moringa powder helps support immunity, energy levels, digestion, and overall health due to its high nutrient content."
            }
        },
        {
            "@type": "Question",
            "name": "When is the best time to take moringa powder?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The best time to take moringa powder is in the morning on an empty stomach or with meals."
            }
        },
        {
            "@type": "Question",
            "name": "Can moringa powder boost immunity?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, moringa powder contains antioxidants and nutrients that help support a healthy immune system."
            }
        },
        {
            "@type": "Question",
            "name": "Is moringa good for weight management?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Moringa powder may support metabolism and nutrition, which can help in healthy weight management."
            }
        },
        {
            "@type": "Question",
            "name": "What is Moringa Powder?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Moringa powder is made from dried moringa leaves and is rich in essential vitamins, minerals, antioxidants, and plant protein that support immunity and daily wellness."
            }
        },
        {
            "@type": "Question",
            "name": "Is Moringa Powder Safe for Daily Use?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, moringa powder is safe for daily use when consumed in recommended amounts. It is a natural superfood widely used for its health benefits."
            }
        }
    ]
};

// Product Schema for featured moringa powder
const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Organic Moringa Powder",
    "image": "https://oryizon.com/images/products/product-1.png",
    "description": "Premium organic moringa powder rich in vitamins, minerals & antioxidants. Boost immunity, energy & overall wellness naturally with Oryizon.",
    "brand": {
        "@type": "Brand",
        "name": "Oryizon"
    },
    "sku": "moringa-powder-100g",
    "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "299",
        "highPrice": "1799",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "offerCount": "3",
        "seller": {
            "@type": "Organization",
            "name": "Oryizon"
        }
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1247",
        "bestRating": "5",
        "worstRating": "1"
    },
    "category": "Health & Wellness Supplements",
    "material": "100% Organic Moringa Oleifera Leaf Powder",
    "additionalProperty": [
        {
            "@type": "PropertyValue",
            "name": "Certification",
            "value": "USDA Organic, FSSAI, ISO 22000"
        },
        {
            "@type": "PropertyValue",
            "name": "Diet",
            "value": "Vegan, Gluten-Free, Non-GMO"
        }
    ]
};

// Organization Schema
const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Oryizon",
    "url": "https://oryizon.com",
    "logo": "https://oryizon.com/images/products/product-1.png",
    "description": "Premium organic moringa powder for daily health, immunity, and wellness.",
    "email": "oryizoncompany@gmail.com",
    "telephone": "+918969124404",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Singhpur Haraiya",
        "addressLocality": "Raxaul",
        "addressRegion": "Bihar",
        "postalCode": "845350",
        "addressCountry": "IN"
    },
    "sameAs": [
        "https://facebook.com/oryizon",
        "https://instagram.com/oryizon",
        "https://twitter.com/oryizon",
        "https://youtube.com/oryizon"
    ],
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+918969124404",
        "contactType": "customer service",
        "availableLanguage": ["English", "Hindi"]
    }
};

// WebSite Schema for sitelinks search box
const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Oryizon",
    "url": "https://oryizon.com",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://oryizon.com/products?q={search_term_string}",
        "query-input": "required name=search_term_string"
    }
};

export function StructuredData() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
        </>
    );
}
