import type { Metadata } from 'next';
import { getBlogBySlug as getLocalBlogBySlug } from '@/data/blog';
import { getBlogPostBySlug } from '@/lib/api/blog';
import { BlogPostClient } from '@/components/blog/BlogPostClient';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    let post = await getBlogPostBySlug(slug).catch(() => null);
    if (!post) {
        post = (getLocalBlogBySlug(slug) as any) || null;
    }

    if (!post) {
        return {
            title: 'Article Not Found | Oryizon Blog',
            description: 'The requested health & wellness article could not be found.',
        };
    }

    const seoTitle = `${post.title} | Oryizon`;
    const seoDescription = post.excerpt || `Read complete guide on ${post.title}. Discover benefits of organic moringa leaf powder, best usage tips, dosage & where to buy pure moringa online across India, Bihar & Nepal.`;
    const canonicalUrl = `https://oryizon.com/blog/${slug}`;
    const ogImage = post.image && (post.image.startsWith('http') || post.image.startsWith('/'))
        ? (post.image.startsWith('http') ? post.image : `https://oryizon.com${post.image}`)
        : 'https://oryizon.com/images/blog/moringa-hero.png';

    const tags = post.tags || [];

    return {
        title: seoTitle,
        description: seoDescription,
        keywords: [
            ...tags,
            "Buy organic moringa powder online",
            "Pure moringa leaf powder 250g",
            "Moringa powder 500g",
            "Best organic moringa powder price",
            "Moringa powder in Nepal",
            "Moringa powder in Bihar",
            "Moringa powder India",
            "100% pure organic moringa powder",
            "organic moringa oleifera benefits",
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
            type: 'article',
            publishedTime: post.date,
            authors: [post.author || 'Dr. Priya Sharma'],
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: seoTitle,
            description: seoDescription,
            images: [ogImage],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;

    let post = await getBlogPostBySlug(slug).catch(() => null);
    if (!post) {
        post = (getLocalBlogBySlug(slug) as any) || null;
    }

    const postTitle = post ? post.title : 'Organic Moringa Guide';
    const postExcerpt = post?.excerpt || 'Health and nutrition guide on pure organic moringa.';
    const ogImage = post?.image && (post.image.startsWith('http') || post.image.startsWith('/'))
        ? (post.image.startsWith('http') ? post.image : `https://oryizon.com${post.image}`)
        : 'https://oryizon.com/images/blog/moringa-hero.png';

    // BlogPosting & Breadcrumb JSON-LD Structured Data
    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://oryizon.com/blog/${slug}`,
        },
        headline: postTitle,
        description: postExcerpt,
        image: [ogImage],
        datePublished: post?.date || '2026-02-10',
        dateModified: new Date().toISOString().split('T')[0],
        author: {
            '@type': 'Person',
            name: post?.author || 'Dr. Priya Sharma',
            jobTitle: 'Holistic Nutritionist & Ayurvedic Researcher',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Oryizon',
            logo: {
                '@type': 'ImageObject',
                url: 'https://oryizon.com/images/oryizon-logo.png',
            },
        },
        keywords: [
            "Buy organic moringa powder online",
            "Pure moringa leaf powder 250g",
            "Moringa powder 500g",
            "Best organic moringa powder price",
            "Moringa powder in Nepal",
            "Moringa powder in Bihar",
            "Moringa powder India",
        ].join(', '),
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
                name: 'Blog',
                item: 'https://oryizon.com/blog',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: postTitle,
                item: `https://oryizon.com/blog/${slug}`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <BlogPostClient initialSlug={slug} />
        </>
    );
}
