'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProducts } from '@/lib/api/products';
import { getAllProducts as getLocalProducts } from '@/data/products';
import { ProductCard } from '@/components/ui/Card';
import { CERTIFICATIONS } from '@/lib/constants';
import type { ProductWithVariants } from '@/types/database';
import { Loader2 } from 'lucide-react';

// Adapter function to convert Supabase product to existing ProductCard format
function adaptProduct(product: ProductWithVariants) {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.original_price || undefined,
        description: product.description || '',
        shortDescription: product.short_description || product.description || '',
        image: (() => {
            const img = product.images?.[0];
            if (!img) return '/images/products/product-1.png';
            if (img.startsWith('http') || img.startsWith('/')) return img;
            return `/images/products/${img}`;
        })(),
        images: product.images?.map(img => {
            if (img.startsWith('http') || img.startsWith('/')) return img;
            return `/images/products/${img}`;
        }) || [],
        category: product.category,
        rating: product.rating,
        reviewCount: product.review_count,
        inStock: product.in_stock,
        featured: product.featured,
        benefits: product.benefits || [],
        ingredients: (product as any).ingredients || [],
        nutritionFacts: (product as any).nutrition_facts || [],
        dosage: (product as any).dosage || { adults: '', elders: '', children: '' },
        certifications: (product as any).certifications || [],
        variants: product.product_variants?.map(v => ({
            id: v.id,
            name: v.name,
            weight: v.name || '',
            price: v.price,
            originalPrice: v.original_price || undefined,
            inStock: v.in_stock,
        })) || [],
    };
}


export default function ProductsPage() {
    const [products, setProducts] = useState<ProductWithVariants[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('featured');

    useEffect(() => {
        async function fetchProducts() {
            try {
                // 1. Fetch API Products (Database)
                const apiProducts = await getProducts();

                // 2. Fetch Local Products (Filesystem Images)
                const localProducts = getLocalProducts();

                // 3. Merge: Use API for data, but Local for Images if available
                const mergedProducts = apiProducts.map(apiProduct => {
                    const localMatch = localProducts.find(p => p.slug === apiProduct.slug);
                    if (localMatch && localMatch.images && localMatch.images.length > 0) {
                        return {
                            ...apiProduct,
                            images: localMatch.images
                        };
                    }
                    // Fallback sanitization for DB-only images
                    if (apiProduct.images) {
                        return {
                            ...apiProduct,
                            images: apiProduct.images.map(img => img.replace(/ /g, '-'))
                        };
                    }
                    return apiProduct;
                });

                setProducts(mergedProducts);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    // Sort products
    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            case 'featured':
            default:
                return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
    });

    return (
        <div className="min-h-screen pt-24">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" suppressHydrationWarning>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-heading text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        Our Products
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg max-w-2xl mx-auto"
                    >
                        Premium organic Moringa products for your health and wellness journey
                    </motion.p>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="bg-[var(--color-cream)] py-6 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
                    <div className="flex flex-wrap justify-center items-center gap-6" suppressHydrationWarning>
                        {CERTIFICATIONS.slice(0, 4).map((cert) => (
                            <div
                                key={cert.id}
                                className="flex items-center gap-2 text-[var(--color-text-light)]"
                            >
                                <span className="text-xl">{cert.icon}</span>
                                <span className="text-sm">{cert.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filter & Sort */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10" suppressHydrationWarning>
                        <p className="text-[var(--color-text-light)]">
                            {loading ? 'Loading products...' : `Showing ${products.length} products`}
                        </p>
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-[var(--color-secondary)] rounded-lg bg-white focus:outline-none focus:border-[var(--color-primary)]"
                            >
                                <option value="featured">Sort by: Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                            <span className="ml-2 text-gray-600">Loading products...</span>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            No products available at the moment.
                        </div>
                    ) : (
                        /* Products */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" suppressHydrationWarning>
                            {sortedProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <ProductCard product={adaptProduct(product)} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Benefits Banner */}
            <section className="bg-[var(--color-secondary)] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { icon: '🚚', title: 'Free Shipping', desc: 'On orders over ₹499' },
                            { icon: '↩️', title: 'Easy Returns', desc: '30-day guarantee' },
                            { icon: '🔒', title: 'Secure Payment', desc: '100% secure checkout' },
                            { icon: '💬', title: 'Support', desc: '24/7 customer support' },
                        ].map((item, index) => (
                            <div key={index}>
                                <span className="text-3xl block mb-2">{item.icon}</span>
                                <h4 className="font-semibold">{item.title}</h4>
                                <p className="text-sm text-[var(--color-text-light)]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
