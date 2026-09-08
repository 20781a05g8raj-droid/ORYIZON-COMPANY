import type { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { blogPosts } from '@/data/blog';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://oryizon.com';

    // Core high-intent static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.95,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/track-order`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/shipping-returns`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/disclaimer`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // Priority mapping for products to maximize high-intent search ranking
    const productEntries: MetadataRoute.Sitemap = products.map((product) => {
        let priority = 0.8;
        let changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly';

        if (product.slug === 'organic-moringa-powder-250g') {
            priority = 1.0;
            changeFrequency = 'daily';
        } else if (product.slug === 'organic-moringa-powder-500g') {
            priority = 0.95;
            changeFrequency = 'daily';
        } else if (product.slug === 'organic-moringa-powder-100g') {
            priority = 0.9;
            changeFrequency = 'daily';
        }

        return {
            url: `${baseUrl}/products/${product.slug}`,
            lastModified: new Date(),
            changeFrequency,
            priority,
        };
    });

    // Dynamic blog articles
    const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => {
        let priority = 0.8;
        if (post.slug === 'moringa-water-on-empty-stomach-benefits') {
            priority = 0.9;
        } else if (post.slug === '10-amazing-health-benefits-of-moringa-powder') {
            priority = 0.85;
        } else if (post.slug === 'how-to-include-moringa-in-your-daily-diet') {
            priority = 0.85;
        }

        return {
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority,
        };
    });

    return [...staticPages, ...productEntries, ...blogEntries];
}
