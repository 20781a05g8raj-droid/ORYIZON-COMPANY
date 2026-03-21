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

const getCinematicTheme = (slug: string) => {
    // 100g - Rose Gold / Bronze luxury vibe
    if (slug.includes('100g')) {
        return {
            bg: 'bg-gradient-to-b from-[#2a1b18] via-[#1a1514] to-[#120e0d] border-[#4a2b25]/50 shadow-[#4a2b25]/20',
            imageBg: 'from-[#1a1514] to-[#2a1b18]/40',
            title: 'text-amber-50',
            desc: 'text-amber-100/60',
            price: 'text-amber-400',
            originalPrice: 'text-amber-500/40',
            badgeBg: 'bg-[#3a1d18]/80 text-amber-200 border-[#5a2e25]',
            buttonBase: 'bg-gradient-to-r from-[#6b3529] to-[#8a4233] hover:from-[#8a4233] hover:to-[#a95240] text-amber-50 border-none shadow-[0_0_15px_rgba(138,66,51,0.4)]',
            accent: 'text-amber-400 fill-amber-400'
        };
    }
    // 250g - Classic Gold / Amber Cinematic vibe (Best Seller)
    if (slug.includes('250g')) {
        return {
            bg: 'bg-gradient-to-b from-[#2d2413] via-[#1c1710] to-[#120f0a] border-[#5c4721]/50 shadow-[#5c4721]/20',
            imageBg: 'from-[#1c1710] to-[#2d2413]/40',
            title: 'text-yellow-50',
            desc: 'text-yellow-100/60',
            price: 'text-yellow-400',
            originalPrice: 'text-yellow-500/40',
            badgeBg: 'bg-[#423316]/80 text-yellow-200 border-[#6b5123]',
            buttonBase: 'bg-gradient-to-r from-[#8a6522] to-[#b3852c] hover:from-[#b3852c] hover:to-[#cca243] text-yellow-50 border-none shadow-[0_0_15px_rgba(179,133,44,0.4)]',
            accent: 'text-yellow-400 fill-yellow-400'
        };
    }
    // 500g - High-end Deep Emerald vibe
    if (slug.includes('500g')) {
        return {
            bg: 'bg-gradient-to-b from-[#132d1d] via-[#0f1d14] to-[#0a140d] border-[#215c38]/50 shadow-[#215c38]/20',
            imageBg: 'from-[#0f1d14] to-[#132d1d]/40',
            title: 'text-emerald-50',
            desc: 'text-emerald-100/60',
            price: 'text-emerald-400',
            originalPrice: 'text-emerald-500/40',
            badgeBg: 'bg-[#184227]/80 text-emerald-200 border-[#25663b]',
            buttonBase: 'bg-gradient-to-r from-[#297a48] to-[#36a15e] hover:from-[#36a15e] hover:to-[#46bf73] text-emerald-50 border-none shadow-[0_0_15px_rgba(54,161,94,0.4)]',
            accent: 'text-emerald-400 fill-emerald-400'
        };
    }
    
    // Default - Deep Midnight Blue / Indigo vibe
    return {
        bg: 'bg-gradient-to-b from-[#131b2d] via-[#0f131d] to-[#0a0d14] border-[#21355c]/50 shadow-[#21355c]/20',
        imageBg: 'from-[#0f131d] to-[#131b2d]/40',
        title: 'text-blue-50',
        desc: 'text-blue-100/60',
        price: 'text-blue-400',
        originalPrice: 'text-blue-500/40',
        badgeBg: 'bg-[#182642]/80 text-blue-200 border-[#253f66]',
        buttonBase: 'bg-gradient-to-r from-[#2e508c] to-[#3d6ab8] hover:from-[#3d6ab8] hover:to-[#5282d4] text-blue-50 border-none shadow-[0_0_15px_rgba(61,106,184,0.4)]',
        accent: 'text-blue-400 fill-blue-400'
    };
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
    const displayPrice = product.price;
    const displayOriginalPrice = product.original_price;
    const discount = displayOriginalPrice ? calculateDiscount(displayOriginalPrice, displayPrice) : 0;

    // Ensure images array exists and has valid URLs
    const images = product.images || [];
    const mainImage = images.length > 0 ? images[0] : null;

    const theme = getCinematicTheme(product.slug);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="h-full"
        >
            <TiltCard tiltStrength={8} scale={1.03} className="h-full rounded-[2rem]">
                <Link href={`/products/${product.slug}`} className={`chamkila-glass block h-full ${theme.bg} rounded-[2rem] hover:-translate-y-2 flex flex-col group`}>
                    {/* Image Container */}
                    <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-t ${theme.imageBg}`}>
                        {/* Cinematic Vignette Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.4)_120%)] z-10 pointer-events-none" />
                        
                        {mainImage ? (
                            <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 z-0"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                priority={priority}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-0">
                                <span className="text-5xl opacity-50 backdrop-blur-sm p-4 rounded-full">🌿</span>
                            </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                            {discount > 0 && (
                                <span className={`px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-full border backdrop-blur-md ${theme.badgeBg}`}>
                                    {discount}% OFF
                                </span>
                            )}
                            {product.featured && (
                                <span className="px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-full border backdrop-blur-md bg-stone-900/80 text-white border-stone-700">
                                    Best Seller
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-grow relative z-20 -mt-8 bg-gradient-to-b from-transparent to-black/40">
                        <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3 drop-shadow-md">
                            <Star className={`w-4 h-4 ${theme.accent}`} />
                            <span className="text-sm font-semibold text-stone-200">
                                {product.rating || 4.8}
                            </span>
                            <span className="text-xs text-stone-400">
                                ({product.review_count || 0})
                            </span>
                        </div>

                        <h3 className={`font-heading text-lg sm:text-xl md:text-2xl font-bold ${theme.title} mb-2 sm:mb-3 line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem] tracking-tight drop-shadow-md`}>
                            {product.name}
                        </h3>

                        <p className={`text-xs sm:text-sm ${theme.desc} mb-4 sm:mb-6 line-clamp-2 flex-grow leading-relaxed hidden xs:block`}>
                            {product.short_description || product.description}
                        </p>

                        <div className="mt-auto pt-3 sm:pt-4 border-t border-white/5">
                            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-3 sm:mb-5">
                                <span className={`text-lg sm:text-3xl font-bold font-heading ${theme.price} drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
                                    {formatPrice(displayPrice)}
                                </span>
                                {displayOriginalPrice && (
                                    <span className={`text-xs sm:text-sm font-medium line-through ${theme.originalPrice}`}>
                                        {formatPrice(displayOriginalPrice)}
                                    </span>
                                )}
                            </div>

                            <button
                                className={`w-full py-2.5 sm:py-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 font-semibold tracking-wide transition-all duration-300 ${theme.buttonBase}`}
                            >
                                <ShoppingCart className="drop-shadow-md w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="drop-shadow-md text-[10px] sm:text-base">ADD TO CART</span>
                            </button>
                        </div>
                    </div>
                </Link>
            </TiltCard>
        </motion.div>
    );
}
