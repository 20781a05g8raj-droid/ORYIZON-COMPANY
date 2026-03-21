'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Badge } from './Badge';
import { Button } from './Button';

interface ProductCardProps {
    product: Product;
    featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
    const discount = product.originalPrice
        ? calculateDiscount(product.originalPrice, product.price)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={`
        group bg-white/40 backdrop-blur-2xl border border-white/50 overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_24px_64px_rgba(0,0,0,0.2)] hover:-translate-y-2 rounded-3xl
        transition-all duration-500
        ${featured ? 'md:flex md:items-center' : ''}
      `}
        >
            {/* Image */}
            <div className={`relative overflow-hidden ${featured ? 'md:w-1/2' : 'aspect-square'}`}>
                <div className="aspect-square relative bg-[var(--color-cream)]">
                    {/* Primary Image */}
                    {product.images?.[0] ? (
                        <img
                            src={(() => {
                                const img = product.images[0];
                                if (img.startsWith('http') || img.startsWith('/')) return img;
                                return `/images/products/${img}`;
                            })()}
                            alt={product.name}
                            className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${product.images[1] ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/products/product-1.png';
                            }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-6xl">🌿</span>
                        </div>
                    )}

                    {/* Secondary Image (Reveal on Hover) */}
                    {product.images?.[1] && (
                        <img
                            src={(() => {
                                const img = product.images[1];
                                if (img.startsWith('http') || img.startsWith('/')) return img;
                                return `/images/products/${img}`;
                            })()}
                            alt={`${product.name} - Alternate View`}
                            className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/products/product-2.png';
                            }}
                        />
                    )}
                </div>

                {/* Discount Badge */}
                {discount > 0 && (
                    <div className="absolute top-3 left-3 z-10">
                        <Badge variant="accent" size="sm">
                            {discount}% OFF
                        </Badge>
                    </div>
                )}

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                    <Link href={`/products/${product.slug}`}>
                        <Button variant="secondary" size="sm" shiny>
                            Quick View
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className={`p-5 ${featured ? 'md:w-1/2 md:p-8' : ''}`}>
                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center text-yellow-500">
                        {'★'.repeat(Math.round(product.rating))}
                        {'☆'.repeat(5 - Math.round(product.rating))}
                    </div>
                    <span className="text-sm text-[var(--color-text-light)]">
                        ({product.reviewCount})
                    </span>
                </div>

                {/* Title */}
                <Link href={`/products/${product.slug}`}>
                    <h3 className={`font-heading font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors ${featured ? 'text-2xl' : 'text-lg'}`}>
                        {product.name}
                    </h3>
                </Link>

                {/* Description */}
                <p className="text-[var(--color-text-light)] mt-2 text-sm line-clamp-2">
                    {product.shortDescription}
                </p>

                {/* Price */}
                <div className="flex items-center gap-3 mt-4">
                    <span className={`font-bold text-[var(--color-primary)] ${featured ? 'text-2xl' : 'text-xl'}`}>
                        {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                        <span className="text-[var(--color-text-muted)] line-through">
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                </div>

                {/* CTA */}
                <div className="mt-4">
                    <Link href={`/products/${product.slug}`}>
                        <Button variant="primary" size={featured ? 'lg' : 'md'} fullWidth>
                            View Product
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
