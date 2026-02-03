'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { getFeaturedProduct } from '@/data/products';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function FeaturedProduct() {
    const product = getFeaturedProduct();

    if (!product) return null;

    // Check for 100g variant to display its price by default (lowest price point)
    const variant100g = product.variants.find(v => v.name.toLowerCase().includes('100g') || v.name.toLowerCase().includes('100 g'));

    const displayPrice = variant100g ? variant100g.price : product.price;
    const displayOriginalPrice = variant100g ? variant100g.originalPrice : product.originalPrice;

    const discount = displayOriginalPrice
        ? calculateDiscount(displayOriginalPrice, displayPrice)
        : 0;

    return (
        <section style={{ padding: '5rem 0', backgroundColor: '#F5F1E8' }} suppressHydrationWarning>
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }} suppressHydrationWarning>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }} suppressHydrationWarning>
                    {/* Product Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{ position: 'relative' }}
                    >
                        <div style={{
                            position: 'relative',
                            aspectRatio: '1',
                            backgroundColor: 'white',
                            borderRadius: '1.5rem',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }} suppressHydrationWarning>
                            {product.images[0] ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'linear-gradient(135deg, #4A7C23 0%, #2D5016 100%)'
                                }}>
                                    <div
                                        className="text-8xl animate-spin-slow"
                                        style={{ display: 'inline-block' }}
                                    >
                                        🌿
                                    </div>
                                </div>
                            )}

                            {/* Discount Badge */}
                            {discount > 0 && (
                                <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem' }}>
                                    <Badge variant="accent" size="md">
                                        {discount}% OFF
                                    </Badge>
                                </div>
                            )}

                            {/* Best Seller Badge */}
                            <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                                <Badge variant="success" size="md">
                                    ⭐ Best Seller
                                </Badge>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div
                            className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-white font-bold shadow-gold animate-float-slow"
                            style={{
                                color: 'white',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 20px rgba(196, 163, 90, 0.3)'
                            }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.75rem' }}>FROM</div>
                                <div style={{ fontSize: '1.125rem' }}>{formatPrice(displayPrice)}</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span style={{ color: '#C4A35A', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem' }}>
                            Featured Product
                        </span>

                        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2.25rem, 5vw, 3rem)', fontWeight: 700, marginTop: '0.5rem', marginBottom: '1rem', color: '#2C2C2C' }} suppressHydrationWarning>
                            {product.name}
                        </h2>

                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }} suppressHydrationWarning>
                            <div style={{ display: 'flex', color: '#C4A35A' }} suppressHydrationWarning>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={20}
                                        fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                                    />
                                ))}
                            </div>
                            <span style={{ color: '#666666' }}>
                                {product.rating} ({product.reviewCount} reviews)
                            </span>
                        </div>

                        {/* Description */}
                        <p style={{ color: '#666666', fontSize: '1.125rem', marginBottom: '1.5rem', lineHeight: 1.6 }} suppressHydrationWarning>
                            {product.shortDescription}
                        </p>

                        {/* Key Benefits */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '2rem' }} suppressHydrationWarning>
                            {product.benefits.slice(0, 4).map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    suppressHydrationWarning
                                >
                                    <span style={{
                                        width: '1.25rem',
                                        height: '1.25rem',
                                        borderRadius: '9999px',
                                        backgroundColor: '#2D5016',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem'
                                    }}>
                                        ✓
                                    </span>
                                    <span style={{ fontSize: '0.875rem', color: '#2C2C2C' }}>{benefit}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem' }} suppressHydrationWarning>
                            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.25rem', fontWeight: 700, color: '#2D5016' }}>
                                {formatPrice(displayPrice)}
                            </span>
                            {displayOriginalPrice && (
                                <span style={{ fontSize: '1.25rem', color: '#999999', textDecoration: 'line-through' }}>
                                    {formatPrice(displayOriginalPrice)}
                                </span>
                            )}
                            {discount > 0 && (
                                <Badge variant="success">Save {formatPrice(displayOriginalPrice! - displayPrice)}</Badge>
                            )}
                        </div>

                        {/* Variants */}
                        <div style={{ marginBottom: '2rem' }} suppressHydrationWarning>
                            <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.75rem', color: '#2C2C2C' }}>Select Size:</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }} suppressHydrationWarning>
                                {product.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            border: '2px solid #2D5016',
                                            borderRadius: '0.5rem',
                                            color: '#2D5016',
                                            background: 'transparent',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#2D5016';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = '#2D5016';
                                        }}
                                    >
                                        {variant.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CTAs */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} suppressHydrationWarning>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }} suppressHydrationWarning>
                                <Link href={`/products/${product.slug}`} style={{ flex: 1 }}>
                                    <Button variant="primary" size="lg" fullWidth icon={<ShoppingCart size={20} />}>
                                        Add to Cart
                                    </Button>
                                </Link>
                                <Link href={`/products/${product.slug}`}>
                                    <Button variant="outline" size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Trust Elements */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '2rem', fontSize: '0.875rem', color: '#666666' }} suppressHydrationWarning>
                            <span>🚚 Free Shipping over ₹499</span>
                            <span>↩️ 30-Day Returns</span>
                            <span>🔒 Secure Checkout</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section >
    );
}
