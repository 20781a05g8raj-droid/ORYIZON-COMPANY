'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getAllProducts as getLocalProducts } from '@/data/products';
import { getFeaturedProducts } from '@/lib/api/products';
import { ProductWithVariants } from '@/types/database';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';

export function FeaturedProduct() {
    const [products, setProducts] = useState<ProductWithVariants[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeatured() {
            try {
                // 1. Fetch API Products (Database)
                const apiProducts = await getFeaturedProducts();

                // 2. Fetch Local Products (Filesystem Images)
                const localProducts = getLocalProducts();

                // 3. Process products to merge images
                const processedProducts = apiProducts.map(apiProd => {
                    const localMatch = localProducts.find(p => p.slug === apiProd.slug);

                    // Prioritize API (Database) images
                    if (apiProd.images && apiProd.images.length > 0) {
                        return {
                            ...apiProd,
                            images: apiProd.images.map(img => {
                                const sanitized = img.replace(/ /g, '-');
                                if (sanitized.startsWith('http') || sanitized.startsWith('/')) return sanitized;
                                return `/images/products/${sanitized}`;
                            })
                        };
                    } else if (localMatch && localMatch.images && localMatch.images.length > 0) {
                        // Fallback to local images
                        return {
                            ...apiProd,
                            images: localMatch.images
                        };
                    }
                    return apiProd;
                });

                // Filter for our specific moringa powder products if needed, or just take all featured
                // The user specifically wants the 3 sizes: 100g, 250g, 500g
                // We'll prioritize showing these if they exist, otherwise show all featured
                const specificProducts = processedProducts.filter(p =>
                    p.slug.includes('organic-moringa-powder') &&
                    (p.slug.endsWith('100g') || p.slug.endsWith('250g') || p.slug.endsWith('500g'))
                );

                setProducts(specificProducts.length > 0 ? specificProducts : processedProducts.slice(0, 3));

            } catch (error) {
                console.error('Failed to fetch featured products:', error);
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
                <div className="text-center mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block"
                    >
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
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {/* Sort by price likely? Or strict order 100 -> 250 -> 500. 
                        We can sort them by price to ensure order: 100g < 250g < 500g */}
                    {products
                        .sort((a, b) => a.price - b.price)
                        .map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                priority={index === 1} // Prioritize middle image? or first?
                            />
                        ))}
                </div>

                <div className="mt-16 text-center">
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
