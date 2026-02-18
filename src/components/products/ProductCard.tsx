'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TiltCard } from '@/components/ui/animations/TiltCard';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { ProductWithVariants } from '@/types/database';

interface ProductCardProps {
    product: ProductWithVariants;
    priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
    const displayPrice = product.price;
    const displayOriginalPrice = product.original_price;
    const discount = displayOriginalPrice ? calculateDiscount(displayOriginalPrice, displayPrice) : 0;

    // Ensure images array exists and has valid URLs
    const images = product.images || [];
    const mainImage = images.length > 0 ? images[0] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="h-full"
        >
            <TiltCard tiltStrength={5} scale={1.02} className="h-full rounded-3xl">
                <Link href={`/products/${product.slug}`} className="block h-full bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 hover:shadow-xl transition-shadow flex flex-col">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-stone-50">
                        {mainImage ? (
                            <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                priority={priority}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-primary)]">
                                <span className="text-4xl">🌿</span>
                            </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {discount > 0 && (
                                <Badge variant="accent" size="sm" className="shadow-sm">
                                    {discount}% OFF
                                </Badge>
                            )}
                            {product.featured && (
                                <Badge variant="success" size="sm" className="shadow-sm">
                                    Best Seller
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-center gap-1 mb-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium text-stone-600">
                                {product.rating || 4.8}
                            </span>
                            <span className="text-xs text-stone-400">
                                ({product.review_count || 0})
                            </span>
                        </div>

                        <h3 className="font-heading text-lg font-bold text-[var(--color-text)] mb-2 line-clamp-2 min-h-[3.5rem]">
                            {product.name}
                        </h3>

                        <p className="text-sm text-stone-500 mb-4 line-clamp-2 flex-grow">
                            {product.short_description || product.description}
                        </p>

                        <div className="mt-auto">
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-2xl font-bold text-[var(--color-primary)]">
                                    {formatPrice(displayPrice)}
                                </span>
                                {displayOriginalPrice && (
                                    <span className="text-sm text-stone-400 line-through">
                                        {formatPrice(displayOriginalPrice)}
                                    </span>
                                )}
                            </div>

                            <Button
                                variant="primary"
                                fullWidth
                                size="md"
                                icon={<ShoppingCart size={18} />}
                                className="rounded-xl"
                            >
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </Link>
            </TiltCard>
        </motion.div>
    );
}
