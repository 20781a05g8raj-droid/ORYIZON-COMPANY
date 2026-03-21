'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getAllProducts as getLocalProducts } from '@/data/products';
import { getFeaturedProducts } from '@/lib/api/products';
import { ProductWithVariants } from '@/types/database';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';
import { useScrollReveal, useCardFlyInStagger, useTextTranslateReveal } from '@/hooks/useScrollReveal';

export function FeaturedProduct() {
    const [products, setProducts] = useState<ProductWithVariants[]>([]);
    const [loading, setLoading] = useState(true);

    // GSAP scroll reveal for header (Text Translate)
    const headerRef = useTextTranslateReveal<HTMLDivElement>({
        direction: 'right',
        distance: 40,
        duration: 0.8,
        ease: 'power3.out',
    });

    // GSAP stagger for product grid
    const gridRef = useCardFlyInStagger<HTMLDivElement>({
        distance: 200,
        stagger: 0.15,
        duration: 0.9,
    });

    // GSAP scroll reveal for CTA
    const ctaRef = useScrollReveal<HTMLDivElement>({
        scale: 0.9,
        y: 25,
        duration: 0.7,
        ease: 'power2.out',
    });

    useEffect(() => {
        async function fetchFeatured() {
            try {
                // 1. Fetch API Products (Database)
                let apiProducts: any[] = [];
                try {
                    apiProducts = await getFeaturedProducts();
                } catch (err) {
                    console.warn("API fetch failed, falling back to local products", err);
                }

                // 2. Fetch Local Products (Filesystem Images)
                const localProducts = getLocalProducts();

                if (!apiProducts || apiProducts.length === 0) {
                    apiProducts = localProducts;
                }

                // 3. Process products to merge images
                const processedProducts = apiProducts.map(apiProd => {
                    const localMatch = localProducts.find(p => p.slug === apiProd.slug);

                    const merged = { ...apiProd };
                    // Map local keys to API keys if they are missing
                    if (!merged.original_price && apiProd.originalPrice) merged.original_price = apiProd.originalPrice;
                    if (!merged.review_count && apiProd.reviewCount) merged.review_count = apiProd.reviewCount;
                    if (!merged.short_description && apiProd.shortDescription) merged.short_description = apiProd.shortDescription;

                    // Prioritize API (Database) images
                    if (apiProd.images && apiProd.images.length > 0) {
                        return {
                            ...merged,
                            images: apiProd.images.map((img: string) => {
                                const sanitized = img.replace(/ /g, '-');
                                if (sanitized.startsWith('http') || sanitized.startsWith('/')) return sanitized;
                                return `/images/products/${sanitized}`;
                            })
                        };
                    } else if (localMatch && localMatch.images && localMatch.images.length > 0) {
                        // Fallback to local images
                        return {
                            ...merged,
                            images: localMatch.images
                        };
                    }
                    return merged;
                });

                // Filter for our specific moringa powder products if needed
                const specificProducts = processedProducts.filter(p =>
                    p.slug.includes('organic-moringa-powder') &&
                    (p.slug.endsWith('100g') || p.slug.endsWith('250g') || p.slug.endsWith('500g'))
                );

                setProducts((specificProducts.length > 0 ? specificProducts : processedProducts.slice(0, 3)) as ProductWithVariants[]);

            } catch (error) {
                console.error('Failed to load products completely:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeatured();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-[var(--color-secondary)]">
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-[var(--color-secondary)] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[var(--color-primary-light)] to-transparent blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[var(--color-accent-light)] to-transparent blur-3xl opacity-50" />
            </div>

            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
                {/* Header — GSAP scroll reveal */}
                <div ref={headerRef} className="text-center mb-12 md:mb-16">
                    <span className="text-[var(--color-accent)] font-semibold uppercase tracking-widest text-xs md:text-sm mb-3 block">
                        Our Best Sellers
                    </span>
                    <h2 className="font-heading text-3xl md:text-5xl font-bold text-[var(--color-text)] mb-6">
                        Choose Your Perfect Size
                    </h2>
                    <p className="text-[var(--color-text-light)] max-w-2xl mx-auto text-lg">
                        Premium organic Moringa powder available in convenient packs to suit your needs.
                        Start small or stock up for the whole family.
                    </p>
                </div>

                {/* Product Grid — GSAP staggered scroll reveal */}
                <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-10">
                    {products
                        .sort((a, b) => a.price - b.price)
                        .map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                priority={index === 1}
                            />
                        ))}
                </div>

                {/* CTA — GSAP scroll reveal */}
                <div ref={ctaRef} className="mt-16 text-center">
                    <Link href="/products">
                        <Button variant="outline" size="lg" icon={<ArrowRight size={20} />} iconPosition="right" className="rounded-full px-8">
                            View All Products
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
