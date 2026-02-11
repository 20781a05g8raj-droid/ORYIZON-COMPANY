'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, ArrowRight, Loader2 } from 'lucide-react';
import { getAllProducts as getLocalProducts } from '@/data/products';
import { getFeaturedProducts } from '@/lib/api/products';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductWithVariants } from '@/types/database';

export function FeaturedProduct() {
    const [product, setProduct] = useState<ProductWithVariants | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeatured() {
            try {
                // 1. Fetch API Products (Database)
                const products = await getFeaturedProducts();

                if (products && products.length > 0) {
                    const apiProduct = products[0];

                    // 2. Fetch Local Products (Filesystem Images)
                    const localProducts = getLocalProducts();
                    const localMatch = localProducts.find(p => p.slug === apiProduct.slug);

                    // 3. Merge: Use API for data, but Local for Images if available
                    let finalProduct = apiProduct;
                    if (localMatch && localMatch.images && localMatch.images.length > 0) {
                        finalProduct = {
                            ...apiProduct,
                            images: localMatch.images
                        };
                    } else if (apiProduct.images) {
                        // Fallback sanitization for DB-only images
                        finalProduct = {
                            ...apiProduct,
                            images: apiProduct.images.map(img => {
                                const sanitized = img.replace(/ /g, '-');
                                if (sanitized.startsWith('http') || sanitized.startsWith('/')) return sanitized;
                                return `/images/products/${sanitized}`;
                            })
                        };
                    }

                    setProduct(finalProduct);
                }
            } catch (error) {
                console.error('Failed to fetch featured product:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeatured();
    }, []);

    if (loading) {
        return (
            <section style={{ padding: '5rem 0', backgroundColor: '#F5F1E8' }}>
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
            </section>
        );
    }

    if (!product) return null;

    // Check for 100g variant to display its price by default (lowest price point)
    const variant100g = product.product_variants?.find(v => v.name.toLowerCase().includes('100g') || v.name.toLowerCase().includes('100 g'));

    const displayPrice = variant100g ? variant100g.price : product.price;
    const displayOriginalPrice = variant100g ? variant100g.original_price : product.original_price;

    // Ensure images array exists
    const images = product.images || [];
    const mainImage = images.length > 0 ? images[0] : null;

    const discount = displayOriginalPrice
        ? calculateDiscount(displayOriginalPrice, displayPrice)
        : 0;

    return (
        <section className="py-14 md:py-20 bg-[var(--color-secondary)]" suppressHydrationWarning>
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" suppressHydrationWarning>
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center" suppressHydrationWarning>
                    {/* Product Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl" suppressHydrationWarning>
                            {mainImage ? (
                                <Image
                                    src={mainImage}
                                    alt="organic moringa powder by Oryizon for immunity and daily health"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)]">
                                    <div className="text-7xl md:text-9xl animate-spin-slow">
                                        🌿
                                    </div>
                                </div>
                            )}

                            {/* Discount Badge */}
                            {discount > 0 && (
                                <div className="absolute top-4 left-4 md:top-6 md:left-6">
                                    <Badge variant="accent" size="md">
                                        {discount}% OFF
                                    </Badge>
                                </div>
                            )}

                            {/* Best Seller Badge */}
                            <div className="absolute top-4 right-4 md:top-6 md:right-6">
                                <Badge variant="success" size="md">
                                    ⭐ Best Seller
                                </Badge>
                            </div>
                        </div>

                        {/* Floating Price Tag — glass effect on mobile */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="absolute -bottom-4 -right-2 md:-right-4 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-full flex items-center justify-center text-white font-bold shadow-2xl shadow-gold/30 animate-float-slow z-10 ring-4 ring-white/20"
                        >
                            <div className="text-center">
                                <div className="text-[10px] md:text-xs opacity-80">FROM</div>
                                <div className="text-base md:text-lg">{formatPrice(displayPrice)}</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col"
                    >
                        <span className="text-[var(--color-accent)] font-semibold uppercase tracking-widest text-xs md:text-sm">
                            Featured Product
                        </span>

                        <h2 className="font-heading text-[1.7rem] leading-tight sm:text-4xl md:text-5xl font-bold mt-2 mb-4 text-[var(--color-text)]" suppressHydrationWarning>
                            {product.name}
                        </h2>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-5 md:mb-6" suppressHydrationWarning>
                            <div className="flex text-[var(--color-accent)]" suppressHydrationWarning>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className="md:w-5 md:h-5"
                                        fill={i < Math.round(Number(product.rating || 5)) ? 'currentColor' : 'none'}
                                    />
                                ))}
                            </div>
                            <span className="text-[var(--color-text-light)] text-sm md:text-base">
                                {product.rating || 5} ({product.review_count || 0} reviews)
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-[var(--color-text-light)] text-[15px] md:text-lg mb-5 md:mb-8 leading-relaxed" suppressHydrationWarning>
                            {product.short_description || product.description}
                        </p>

                        {/* Key Benefits — as mini gradient-bordered cards on mobile */}
                        {product.benefits && product.benefits.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3 mb-6 md:mb-8" suppressHydrationWarning>
                                {product.benefits.slice(0, 4).map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-3 p-3 md:p-0 rounded-xl md:rounded-none bg-white/60 md:bg-transparent border border-[var(--color-secondary)] md:border-none"
                                        suppressHydrationWarning
                                    >
                                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white flex items-center justify-center text-[10px] flex-shrink-0 shadow-sm">
                                            ✓
                                        </span>
                                        <span className="text-sm text-[var(--color-text)] font-medium">{benefit}</span>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-3 md:gap-4 mb-6 md:mb-8" suppressHydrationWarning>
                            <span className="font-heading text-3xl md:text-5xl font-bold text-[var(--color-primary)]">
                                {formatPrice(displayPrice)}
                            </span>
                            {displayOriginalPrice && (
                                <span className="text-lg md:text-2xl text-gray-400 line-through">
                                    {formatPrice(displayOriginalPrice)}
                                </span>
                            )}
                            {discount > 0 && (
                                <Badge variant="success" className="px-3 py-1">Save {formatPrice(displayOriginalPrice! - displayPrice)}</Badge>
                            )}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4" suppressHydrationWarning>
                            <Link href={`/products/${product.slug}`} className="flex-1">
                                <Button variant="primary" size="lg" fullWidth icon={<ShoppingCart size={20} />} className="rounded-2xl h-14 glow-cta">
                                    Add to Cart
                                </Button>
                            </Link>
                            <Link href={`/products/${product.slug}`} className="flex-1">
                                <Button variant="outline" size="lg" fullWidth icon={<ArrowRight size={20} />} iconPosition="right" className="rounded-2xl h-14 border-2">
                                    View Details
                                </Button>
                            </Link>
                        </div>

                        {/* Trust elements — glass pills on mobile */}
                        <div className="flex flex-wrap gap-3 mt-6 md:mt-10" suppressHydrationWarning>
                            {[
                                { icon: '🚚', text: 'Free Shipping over ₹499' },
                                { icon: '↩️', text: '7-Day Returns' },
                                { icon: '🔒', text: 'Secure Checkout' },
                            ].map((item, index) => (
                                <span
                                    key={index}
                                    className="flex items-center gap-2 px-3.5 py-2 md:px-0 md:py-0 rounded-xl md:rounded-none bg-white/70 md:bg-transparent border border-[var(--color-secondary)] md:border-none text-xs md:text-sm text-[var(--color-text-light)] font-medium"
                                >
                                    {item.icon} {item.text}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
