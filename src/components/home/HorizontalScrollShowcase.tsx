'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAllProducts as getLocalProducts } from '@/data/products';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export function HorizontalScrollShowcase() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const localProducts = getLocalProducts();
        setProducts(localProducts.slice(0, 6));
    }, []);

    useEffect(() => {
        if (products.length === 0) return;

        const section = sectionRef.current;
        const track = trackRef.current;
        const progressBar = progressRef.current;
        if (!section || !track || !progressBar) return;

        const totalWidth = track.scrollWidth - window.innerWidth;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: () => `+=${totalWidth}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            },
        });

        tl.to(track, {
            x: -totalWidth,
            ease: 'none',
        });

        // Progress bar
        tl.to(
            progressBar,
            {
                scaleX: 1,
                ease: 'none',
            },
            0
        );

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === section) st.kill();
            });
        };
    }, [products]);

    if (products.length === 0) return null;

    return (
        <section
            ref={sectionRef}
            className="relative bg-[#0a1a04] overflow-hidden"
            style={{ height: '100vh' }}
        >
            {/* Grid Pattern Background */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                }}
            />

            {/* Header */}
            <div className="absolute top-8 md:top-12 left-0 right-0 z-20 px-8 md:px-16 flex items-center justify-between">
                <div>
                    <span className="text-[var(--color-accent)] font-semibold uppercase tracking-[0.3em] text-[10px] md:text-xs block mb-2">
                        Featured Collection
                    </span>
                    <h2 className="font-heading text-2xl md:text-4xl font-bold text-white">
                        Our Products
                    </h2>
                </div>
                <Link href="/products">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10 rounded-full" icon={<ArrowRight size={16} />} iconPosition="right">
                            View All
                        </Button>
                    </motion.div>
                </Link>
            </div>

            {/* Horizontal Track */}
            <div
                ref={trackRef}
                className="flex items-center gap-8 md:gap-12 h-full pl-8 md:pl-16 pt-20"
                style={{ width: 'max-content' }}
            >
                {products.map((product, index) => (
                    <Link
                        key={product.id || index}
                        href={`/products/${product.slug}`}
                        className="group flex-shrink-0"
                    >
                        <motion.div
                            className="relative w-[280px] md:w-[400px] h-[360px] md:h-[480px] rounded-3xl overflow-hidden"
                            whileHover={{ scale: 1.03, rotateY: 3 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            style={{ perspective: '1000px' }}
                        >
                            {/* Image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1a3009] to-[#0a1a04]">
                                {product.images?.[0] && (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                    />
                                )}
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Hover Distortion Effect (CSS transform) */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                {/* Price tag */}
                                {product.price && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-3">
                                        <span className="text-white font-bold text-sm">₹{product.price}</span>
                                        {product.original_price && product.original_price > product.price && (
                                            <span className="text-white/50 text-xs line-through">₹{product.original_price}</span>
                                        )}
                                    </div>
                                )}

                                <h3 className="font-heading text-lg md:text-2xl font-bold text-white mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                                    {product.name}
                                </h3>

                                {/* Rating */}
                                {product.rating && (
                                    <div className="flex items-center gap-1.5">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={12}
                                                    className="text-[var(--color-accent)]"
                                                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-white/50 text-xs">{product.rating}</span>
                                    </div>
                                )}

                                {/* Hover arrow indicator */}
                                <motion.div
                                    className="mt-4 flex items-center gap-2 text-white/60 text-sm font-medium"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileHover={{ opacity: 1, x: 0 }}
                                >
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">View Product</span>
                                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </Link>
                ))}

                {/* Final CTA Card */}
                <div className="flex-shrink-0 w-[280px] md:w-[400px] h-[360px] md:h-[480px] rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center p-8">
                    <div className="text-center">
                        <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
                            Explore Our Full Range
                        </h3>
                        <p className="text-white/60 mb-8 text-sm md:text-base">
                            Discover all our premium organic moringa products
                        </p>
                        <Link href="/products">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="accent" size="lg" className="rounded-full glow-cta" icon={<ArrowRight size={20} />} iconPosition="right">
                                    Shop All
                                </Button>
                            </motion.div>
                        </Link>
                    </div>
                </div>

                {/* Extra padding at end */}
                <div className="flex-shrink-0 w-16 md:w-32" />
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-8 md:bottom-12 left-8 md:left-16 right-8 md:right-16 z-20">
                <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
                    <div
                        ref={progressRef}
                        className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary-light)] rounded-full origin-left"
                        style={{ transform: 'scaleX(0)' }}
                    />
                </div>
            </div>
        </section>
    );
}
